import React, { ReactNode } from 'react'
import { Alert } from 'react-bootstrap'

interface MessageProps {
  variant: string,
  children: any
}
const Message = ({ variant, children }: MessageProps) => {
  return <Alert variant={variant}>{children}</Alert>
}

Message.defaultProps = {
  variant: 'info',
}

export default Message
