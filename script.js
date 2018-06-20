//The four identifiers that we need to connect to Chatkit
const testToken = "https://us1.pusherplatform.io/services/chatkit_token_provider/v1/03d4b246-9da6-480f-8289-8b4470b0b0fa/token"
const instanceLocator = "v1:us1:03d4b246-9da6-480f-8289-8b4470b0b0fa"
const roomId = 9908796
const username = "lorraine"

//The root, Deals with the data and API connection
class App extends React.Component {
    constructor() {
        super()
        this.state = {
            messages: []
        }
        this.sendMessage = this.sendMessage.bind(this)
    } 
    
    componentDidMount() {
        //create a chat manager
        const chatManager = new Chatkit.ChatManager({
            instanceLocator: instanceLocator,
            userId: username,
            tokenProvider: new Chatkit.TokenProvider({
                url: testToken
            })
        })
        //connect to the API
        chatManager.connect()
        .then(currentUser => {
            this.currentUser = currentUser
            this.currentUser.subscribeToRoom({
            roomId: roomId,
            hooks: {
                //onNewMessage will be triggered every time a new message is broadcast
                onNewMessage: message => {

                    this.setState({
                        messages: [...this.state.messages, message]//new message added to the end
                    })
                }
            }
        })
      })
    }
    //When the form is submitted send the text from the current user to the room
    sendMessage(text) {
        this.currentUser.sendMessage({
            text,
            roomId: roomId
        })
    }
    //Renders the three components
    render() {
        return (
            <div className="app">
              <Title />
              <MessageList 
                  roomId={this.state.roomId}
                  messages={this.state.messages} />
              <SendMessageForm
                  sendMessage={this.sendMessage} />
            </div>
        );
    }
}

class MessageList extends React.Component {
    render() {
        return (
            <ul className="message-list">
                {this.props.messages.map((message, index) => {
                    return (
                      <li  key={message.id} className="message">
                        <div>{message.senderId}</div>
                        <div>{message.text}</div>
                      </li>
                    )
                })}
            </ul>
        )
    }
}

class SendMessageForm extends React.Component {
    constructor() {
        super()
        this.state = {
            message: ''
        }
        this.handleChange = this.handleChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
    }
    //updates the state to whatever user input is. Triggers a re-render
    handleChange(e) {
        this.setState({
            message: e.target.value
        })
    }
    //gets the message and resets the input field to blank
    handleSubmit(e) {
        e.preventDefault()
        this.props.sendMessage(this.state.message)
        this.setState({
            message: ''
        })
    }
    
    render() {
        return (
            <form
                onSubmit={this.handleSubmit}//event listener for the enter button
                className="send-message-form">
                <input
                    onChange={this.handleChange}//event listener to listen for user inputs and call the handleChange
                    value={this.state.message}//sets the value
                    placeholder="Type your message and hit ENTER"
                    type="text" />
            </form>
        )
    }
}

function Title() {
  return <p className="title">Sample React Chat App</p>
}

ReactDOM.render(<App />, document.getElementById('root'));

