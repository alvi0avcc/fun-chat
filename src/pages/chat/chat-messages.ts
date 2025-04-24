export interface Message {
  message: string;
  inOut: 'in' | 'out';
  status: {
    isDelivered: boolean;
    isReaded: boolean;
    isEdited: boolean;
  };
}

export interface UserMessages {
  userName: string;
  messages: Message[];
}

class ChatMessages {
  private messages: UserMessages[];

  constructor() {
    this.messages = [];
  }

  public get getAllMessage(): UserMessages[] {
    return this.messages;
  }

  public getUserMessage(userName: string): Message[] | undefined {
    return this.messages.find((user: UserMessages) => user.userName === userName)?.messages;
  }

  public addNewMessage(userName: string, newMessage: string, direction: 'in' | 'out'): void {
    const message: Message = {
      message: newMessage,
      inOut: direction,
      status: {
        isDelivered: direction === 'out' ? false : true,
        isReaded: false,
        isEdited: false,
      },
    };

    const index: number = this.messages.findIndex(
      (user: UserMessages) => user.userName === userName
    );

    if (index === -1) {
      const user: UserMessages = {
        userName: userName,
        messages: [
          {
            message: newMessage,
            inOut: 'in',
            status: {
              isDelivered: direction === 'out' ? false : true,
              isReaded: false,
              isEdited: false,
            },
          },
        ],
      };

      this.messages.push(user);
    } else {
      this.messages[index].messages.push(message);
    }
  }
}

export const chatMessages = new ChatMessages();
