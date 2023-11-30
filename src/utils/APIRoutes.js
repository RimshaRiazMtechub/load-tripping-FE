export const host = "http://localhost:5010";
// export const host = "http://ec2-35-181-168-221.eu-west-3.compute.amazonaws.com:5013";


export const loginRoute = `${host}/user/login`;
export const registerRoute = `${host}/user/register`;
export const uploadImageRoute = `${host}/upload-image`;

export const logoutRoute = `${host}/user/logout`;
export const updateUsernameRoute = `${host}/user/updateUsername`;

export const verifyEmailRoute = `${host}/user/verifyEmail`;
export const getUserOTPUniqID = `${host}/user/getUserByUniqId`;
export const getUserByUniqIdONE = `${host}/user/getUserByUniqIdONE`;

export const getChatRoom = `${host}/chat-room/getChatRoomByUniqId`;

export const allUsersRoute = `${host}/user/getAllUsers`;
export const chatRoomCreate = `${host}/chat-room/createChatRoom`;

export const sendMessageRoute = `${host}/messages/createMessage`;
export const recieveMessageRoute = `${host}/messages/getmsg`;
export const readMessagesRoute = `${host}/messages/readMessages`;

