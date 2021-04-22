(function () {
    //peer 1
    let input1 = null;
    let sendButton1 = null;
    let disconnectButton1 = null;
    let channel1 = null;
    let peer1 = null;
    
    //peer 2
    let input2 = null;
    let sendButton2 = null;
    let disconnectButton2 = null;
    let channel2 = null;
    let peer2;
    
    //message display div
    let messageDiv = null;

    function startup() {

        input1 = document.getElementById('inp-1');
        sendButton1 = document.getElementById('btn-1');
        disconnectButton1 = document.getElementById('disconn-1');
        div1 = document.getElementById('received-message1');

        input2 = document.getElementById('inp-2');
        sendButton2 = document.getElementById('btn-2');
        disconnectButton2 = document.getElementById('disconn-2');
        div2 = document.getElementById('received-message2');

        messageDiv = document.getElementById('messages');

        sendButton1.addEventListener('click', onSend1);
        sendButton2.addEventListener('click', onSend2);

        disconnectButton1.addEventListener('click', onDisconnect1);
        disconnectButton2.addEventListener('click', onDisconnect2);

        input1.addEventListener('keyup', (event) => {
            if(event.key === 'Enter') {
                sendButton1.click();
            }
        })

        input2.addEventListener('keyup', (event) => {
            if(event.key === 'Enter') {
                sendButton2.click();
            }
        })

        //scenario for two peers using single data channel using out-of-band negotiation using an agreed upon id
        peer1 = new RTCPeerConnection();
        channel1 = peer1.createDataChannel("chat", { negotiated: true, id: 1 });

        channel1.onmessage = function (event) {
            handleReceivedMessage('Peer 1 received: ' + event.data);
        }


        peer2 = new RTCPeerConnection();
        channel2 = peer2.createDataChannel("chat", { negotiated: true, id: 1 });

        channel2.onmessage = function (event) {
            handleReceivedMessage('Peer 2 received: ' + event.data);
        }

        //Scenario for multiple data channels
        // peer1.ondatachannel = function (event) {
        //     console.log('ondata 1');
        //     peer1ReceiveChannel = event.channel;
        //     peer1ReceiveChannel.onmessage = (event) => {
        //         console.log('Peer 1 received: ' + event.data);
        //     }
        // }

        // peer2.ondatachannel = function (event) {
        //     console.log('ondata 2');
        //     peer2ReceiveChannel = event.channel;
        //     peer2ReceiveChannel.onmessage = (event) => {
        //         console.log('Peer 2 received: ' + event.data);
        //     }
        // }

        peer1.onicecandidate = function (event) {
            if (event.candidate) {
                peer2.addIceCandidate(event.candidate);
            }
        }

        peer2.onicecandidate = function (event) {
            if (event.candidate) {
                peer1.addIceCandidate(event.candidate);
            }
        }

        peer1.createOffer()
            .then(offer => peer1.setLocalDescription(offer))
            .then(() => peer2.setRemoteDescription(peer1.localDescription))
            .then(() => peer2.createAnswer())
            .then(answer => peer2.setLocalDescription(answer))
            .then(() => peer1.setRemoteDescription(peer2.localDescription))
            .catch(console.log);
    }

    function handleReceivedMessage(data) {
        const div = document.createElement('p');
        const msgNode = document.createTextNode(data);
        div.appendChild(msgNode);
        messageDiv.appendChild(div);
    }

    function onDisconnect1() {
        channel1.close();
        peer1.close();
    }

    function onDisconnect2() {
        channel2.close();
        peer2.close();
    }

    function onSend1() {

        console.log('channel 1 ready state: ' + channel1.readyState);
    
        if (channel1.readyState === "open") {
            const message = input1.value;
            channel1.send(message);
        }
    }

    function onSend2() {

        console.log('channel 2 ready state: ' + channel2.readyState);
        
        if (channel2.readyState === "open") {
            const message = input2.value;
            channel2.send(message);
        }
    }

    window.addEventListener('load', startup);
})();