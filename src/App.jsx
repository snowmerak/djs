import React from 'react'
import {
  Box,
  Container,
  Heading,
  Text,
  Button,
  Input,
  FormControl,
  FormLabel,
  VStack,
  HStack,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Badge,
  IconButton,
  useToast,
  Flex,
  Card,
  CardHeader,
  CardBody,
  Divider,
  Alert,
  AlertIcon,
  AlertDescription,
} from '@chakra-ui/react'
import { DeleteIcon, CopyIcon, SettingsIcon, RepeatIcon } from '@chakra-ui/icons'

function App() {
  const [streamerId, setStreamerId] = React.useState('')
  const [prefix, setPrefix] = React.useState('!신청')
  const [isConnected, setIsConnected] = React.useState(false)
  const [connectionMessage, setConnectionMessage] = React.useState('')
  const [connectionStatus, setConnectionStatus] = React.useState('disconnected')
  const [songRequests, setSongRequests] = React.useState([])
  const [showSettings, setShowSettings] = React.useState(true)
  const toast = useToast()

  React.useEffect(() => {
    // Electron API 존재 확인
    if (!window.electronAPI) {
      console.error('Electron API not available')
      toast({
        title: '오류',
        description: 'Electron API를 찾을 수 없습니다',
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
      return
    }

    // 연결 상태 리스너
    window.electronAPI.onConnectionStatus((data) => {
      setConnectionMessage(data.message)
      setConnectionStatus(data.status)
      
      if (data.status === 'connected' || data.status === 'entered') {
        setIsConnected(true)
        toast({
          title: '연결 성공',
          description: data.message,
          status: 'success',
          duration: 3000,
          isClosable: true,
        })
      } else if (data.status === 'disconnected') {
        setIsConnected(false)
      } else if (data.status === 'error') {
        setIsConnected(false)
        toast({
          title: '연결 오류',
          description: data.message,
          status: 'error',
          duration: 5000,
          isClosable: true,
        })
      }
    })

    // 신청곡 리스너
    window.electronAPI.onNewSongRequest((data) => {
      setSongRequests(prev => [...prev, data])
      toast({
        title: '새 신청곡',
        description: `${data.username}: ${data.songRequest}`,
        status: 'info',
        duration: 2000,
        isClosable: true,
      })
    })

    return () => {
      window.electronAPI.removeAllListeners('connection-status')
      window.electronAPI.removeAllListeners('new-song-request')
    }
  }, [toast])

  const handleConnect = async () => {
    if (!streamerId.trim()) {
      toast({
        title: '입력 오류',
        description: '스트리머 ID를 입력해주세요',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      })
      return
    }
    if (!prefix.trim()) {
      toast({
        title: '입력 오류',
        description: '신청곡 prefix를 입력해주세요',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      })
      return
    }

    try {
      await window.electronAPI.connectChat(streamerId.trim(), prefix.trim())
      setShowSettings(false)
    } catch (error) {
      toast({
        title: '연결 실패',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
    }
  }

  const handleDisconnect = async () => {
    try {
      await window.electronAPI.disconnectChat()
      setIsConnected(false)
      toast({
        title: '연결 해제',
        description: '채팅 연결이 해제되었습니다',
        status: 'info',
        duration: 3000,
        isClosable: true,
      })
    } catch (error) {
      toast({
        title: '연결 해제 실패',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
    }
  }

  const handleClearList = () => {
    if (window.confirm('신청곡 목록을 초기화하시겠습니까?')) {
      setSongRequests([])
      toast({
        title: '목록 초기화',
        description: '신청곡 목록이 초기화되었습니다',
        status: 'success',
        duration: 2000,
        isClosable: true,
      })
    }
  }

  const handleRemoveRequest = (index) => {
    setSongRequests(prev => prev.filter((_, i) => i !== index))
  }

  const handleCopyList = () => {
    const text = songRequests
      .map((req, idx) => `${idx + 1}. [${req.timestamp}] ${req.username}: ${req.songRequest}`)
      .join('\n')
    
    navigator.clipboard.writeText(text)
      .then(() => {
        toast({
          title: '복사 완료',
          description: '목록이 클립보드에 복사되었습니다',
          status: 'success',
          duration: 2000,
          isClosable: true,
        })
      })
      .catch(err => {
        toast({
          title: '복사 실패',
          description: err.message,
          status: 'error',
          duration: 3000,
          isClosable: true,
        })
      })
  }

  const getStatusColor = () => {
    if (connectionStatus === 'connected' || connectionStatus === 'entered') return 'green'
    if (connectionStatus === 'reconnecting') return 'yellow'
    if (connectionStatus === 'error') return 'red'
    return 'gray'
  }

  return (
    <Box minH="100vh" bgGradient="linear(to-br, purple.400, purple.600)">
      {/* Header */}
      <Box bg="white" shadow="md" py={4} px={6}>
        <Flex justify="space-between" align="center" maxW="1400px" mx="auto">
          <Heading size="lg" color="purple.600">
            🎵 SOOP DJ Helper
          </Heading>
          <HStack spacing={3}>
            <Badge
              colorScheme={getStatusColor()}
              fontSize="md"
              px={3}
              py={1}
              borderRadius="full"
            >
              {isConnected ? '● 연결됨' : '○ 연결 안됨'}
            </Badge>
            {connectionMessage && (
              <Text fontSize="sm" color="gray.600">
                {connectionMessage}
              </Text>
            )}
          </HStack>
        </Flex>
      </Box>

      {/* Main Content */}
      <Container maxW="1400px" py={8}>
        {showSettings ? (
          <Card maxW="500px" mx="auto">
            <CardHeader>
              <Heading size="md">⚙️ 설정</Heading>
            </CardHeader>
            <CardBody>
              <VStack spacing={4} align="stretch">
                <FormControl>
                  <FormLabel>스트리머 ID</FormLabel>
                  <Input
                    value={streamerId}
                    onChange={(e) => setStreamerId(e.target.value)}
                    placeholder="예: beststreamer"
                    isDisabled={isConnected}
                    size="lg"
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>신청곡 Prefix</FormLabel>
                  <Input
                    value={prefix}
                    onChange={(e) => setPrefix(e.target.value)}
                    placeholder="예: !신청"
                    isDisabled={isConnected}
                    size="lg"
                  />
                </FormControl>

                <Divider />

                <HStack spacing={3}>
                  {!isConnected ? (
                    <Button
                      colorScheme="purple"
                      size="lg"
                      onClick={handleConnect}
                      width="full"
                    >
                      연결하기
                    </Button>
                  ) : (
                    <>
                      <Button
                        colorScheme="gray"
                        size="lg"
                        onClick={() => setShowSettings(false)}
                        flex={1}
                      >
                        신청곡 목록 보기
                      </Button>
                      <Button
                        colorScheme="red"
                        size="lg"
                        onClick={handleDisconnect}
                        flex={1}
                      >
                        연결 해제
                      </Button>
                    </>
                  )}
                </HStack>
              </VStack>
            </CardBody>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <Flex justify="space-between" align="center" flexWrap="wrap" gap={3}>
                <Heading size="md">
                  📋 신청곡 목록 ({songRequests.length})
                </Heading>
                <HStack spacing={2} flexWrap="wrap">
                  <Button
                    leftIcon={<SettingsIcon />}
                    colorScheme="gray"
                    onClick={() => setShowSettings(true)}
                    size="sm"
                  >
                    설정
                  </Button>
                  <Button
                    leftIcon={<CopyIcon />}
                    colorScheme="blue"
                    onClick={handleCopyList}
                    isDisabled={songRequests.length === 0}
                    size="sm"
                  >
                    복사
                  </Button>
                  <Button
                    leftIcon={<RepeatIcon />}
                    colorScheme="orange"
                    onClick={handleClearList}
                    isDisabled={songRequests.length === 0}
                    size="sm"
                  >
                    초기화
                  </Button>
                </HStack>
              </Flex>
            </CardHeader>
            <CardBody>
              {songRequests.length === 0 ? (
                <Alert
                  status="info"
                  variant="subtle"
                  flexDirection="column"
                  alignItems="center"
                  justifyContent="center"
                  textAlign="center"
                  minH="200px"
                  borderRadius="md"
                >
                  <AlertIcon boxSize="40px" mr={0} />
                  <Text mt={4} mb={1} fontSize="lg" fontWeight="bold">
                    아직 신청곡이 없습니다
                  </Text>
                  <AlertDescription maxWidth="sm">
                    &quot;{prefix}&quot;로 시작하는 채팅이 수집됩니다
                  </AlertDescription>
                </Alert>
              ) : (
                <TableContainer maxH="60vh" overflowY="auto">
                  <Table variant="simple" size="sm">
                    <Thead position="sticky" top={0} bg="gray.50" zIndex={1}>
                      <Tr>
                        <Th>#</Th>
                        <Th>시간</Th>
                        <Th>유저명</Th>
                        <Th>신청곡</Th>
                        <Th>전체 메시지</Th>
                        <Th>삭제</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {songRequests.map((request, index) => (
                        <Tr
                          key={`${request.timestamp}-${request.userId}-${index}`}
                          _hover={{ bg: 'gray.50' }}
                        >
                          <Td>{index + 1}</Td>
                          <Td>
                            <Text fontSize="sm" color="gray.600">
                              {new Date(request.timestamp).toLocaleTimeString('ko-KR')}
                            </Text>
                          </Td>
                          <Td>
                            <Text fontWeight="bold" color="purple.600">
                              {request.username}
                            </Text>
                          </Td>
                          <Td>
                            <Text fontWeight="semibold">{request.songRequest}</Text>
                          </Td>
                          <Td>
                            <Text fontSize="sm" color="gray.600">
                              {request.comment}
                            </Text>
                          </Td>
                          <Td>
                            <IconButton
                              aria-label="삭제"
                              icon={<DeleteIcon />}
                              size="sm"
                              colorScheme="red"
                              variant="ghost"
                              onClick={() => handleRemoveRequest(index)}
                            />
                          </Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </TableContainer>
              )}
            </CardBody>
          </Card>
        )}
      </Container>

      {/* Footer */}
      <Box bg="whiteAlpha.900" py={4} mt={8}>
        <Container maxW="1400px">
          <Text textAlign="center" color="gray.600" fontSize="sm">
            SOOP DJ Helper v1.0 - 스트리머를 위한 신청곡 관리 도구
          </Text>
        </Container>
      </Box>
    </Box>
  )
}

export default App
