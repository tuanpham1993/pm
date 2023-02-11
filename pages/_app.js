import { ChakraProvider } from '@chakra-ui/react'
import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  FormControl,
  FormLabel,
  Select,
  Input,
} from "@chakra-ui/react";
import { isNil } from 'lodash';
import { useState, useEffect } from "react";
import http from "../shared/util/http";

function MyApp({ Component, pageProps }) {
  const [ isOpen, setIsOpen ] = useState(false);
  const [ username, setUsername ] = useState('')
  const [password, setPassword] = useState('')
  const [authenticated, setAuthenticated ] = useState(false)

  const handleSave = async () => {
    const { status } = await http.get('/products', {
      headers: {
        Authorization: `Basic ${Buffer.from(`${username}:${password}`).toString('base64')}`
      }
    })
    
    if (status === 200) {
      localStorage.setItem('username', username)
      localStorage.setItem('password', password)

      setIsOpen(false)
      setAuthenticated(true)
      location.reload()
    }
  }

  useEffect(() => {
    const username = localStorage.getItem("username");
    if (isNil(username)) {
      setIsOpen(true)
      setAuthenticated(false)
    } else {
      setIsOpen(false)
      setAuthenticated(true)
    }
  });

  return (
    <ChakraProvider>
      {authenticated && <Component {...pageProps} />}

      <Modal closeOnOverlayClick={false} isOpen={isOpen}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Đăng nhập</ModalHeader>
          {/* <ModalCloseButton /> */}
          <ModalBody pb={6}>
            <FormControl>
              <FormLabel>Tên</FormLabel>
              <Input
                placeholder="Tên"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </FormControl>
            <FormControl mt={5}>
              <FormLabel>Mật khẩu</FormLabel>
              <Input
                placeholder="Mật khẩu"
                value={password}
                type="password"
                onChange={(e) => setPassword(e.target.value)}
              />
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="teal" mr={3} onClick={handleSave}>
              Đăng nhập
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </ChakraProvider>
  )
}

export default MyApp