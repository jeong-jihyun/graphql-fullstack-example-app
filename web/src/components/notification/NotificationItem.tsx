import React from 'react'
import { Notification as INotification } from '../../generated/graphql'
import { Box, MenuItem, Text } from '@chakra-ui/react'
interface NotificationItemProp {
    //notification: INotification
    text: string;
    createdAt: string;
}

const NotificationItem = ({ text, createdAt }: NotificationItemProp): React.ReactElement => {
    return (
        <MenuItem cursor={'pointer'} >
            <Box position={'relative'} w={'100%'}>
                <Text>{text}</Text>
                <Text fontSize={'x-small'} color={'gray.500'}>
                    {new Date(parseInt(createdAt, 10)).toLocaleDateString()}
                </Text>
            </Box>
        </MenuItem>
    )
}

export default NotificationItem
