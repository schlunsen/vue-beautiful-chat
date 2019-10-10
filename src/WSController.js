let singleton;

class WSController {
    constructor(domain, token, app) {
        this.token = token;
        this.$store = app.store;
        this.$app = app;

        this.api_domain = `${domain}/ws/`

        this.connected = false;

        this.disconnect_retries = 0;

        if (!singleton) {
            singleton = this;
            this.init()
        } else {
            singleton.$app = app;
        }

        return singleton
    }
    init() {



        this.socket = new WebSocket(this.api_domain + '?token=' + this.token + "&room_group_name=" + this.$app.roomGroupName)

        this.socket.onmessage = this.onmessage.bind(this);
        this.socket.onopen = this.onconnect.bind(this)
        this.socket.onclose = (e) => {


            console.log('Socket is closed. Reconnect will be attempted in 1 second.', e.reason);
            setTimeout(() => {
                this.init();
            }, 1000);
        }



    }

    // XXX 
    async isConnected() {
        let that = this;
        return new Promise(resolve => {
            let checkConnectedInterval = setInterval(() => {

                if (that.connected) {
                    clearInterval(checkConnectedInterval)
                    resolve()
                }

            }, 100);

        });
    }

    addConsole(console) {
        this.console = console
    }

    sendMessage(msg) {
        let data = {
            token: this.token,
            message: msg,
        }
        this.socket.send(JSON.stringify(data))
    }

    sendChat(msg, room_group_name) {

    }

    joinRoom(roomGroupName) {
        
        this.sendMessage(JSON.stringify({
            'command': 'join',
            'room_group_name': roomGroupName
        }))
    }


    onmessage(msg) {
        let data = JSON.parse(msg.data)
        console.info(data)

        if (data.room_group_name) {
            window.localStorage.setItem('room_group_name', data.room_group_name)
            this.$app.roomGroupName = data.room_group_name
        }

        this.$app.$emit('chat_received', data)


        console.log(msg, 'default')


    }

    onconnect() {
        this.connected = true;
        this.sendMessage(JSON.stringify({
            command: 'get_room_name',
            value: 'get_room_name'
        }))
    }

    getSocket() {
        return this.socket;
    }





    disconnect() {
        this.socket.off('disconnect', this.disconnect)
        setTimeout(() => {

            this.socket = null;
            this.init()
        }, 1000)

    }
}




export {
    WSController
}
