(function () {
    //peer 1
    let input1 = null;
    let sendButton1 = null;
    let disconnectButton1 = null;
    let channel1_2 = null;
    let peer1_2 = null;
    let peer1_3 = null;

    //peer 2
    let input2 = null;
    let sendButton2 = null;
    let disconnectButton2 = null;
    let channel2 = null;
    let peer2 = null;

    //peer 3
    let input3 = null;
    let sendButton3 = null;
    let disconnectButton3 = null;
    let channel3 = null;
    let peer3 = null;
    //message display div
    let messageDiv = null;

    function startup() {

        input1 = document.getElementById('inp-1');
        sendButton1 = document.getElementById('btn-1');
        disconnectButton1 = document.getElementById('disconn-1');

        input2 = document.getElementById('inp-2');
        sendButton2 = document.getElementById('btn-2');
        disconnectButton2 = document.getElementById('disconn-2');

        input3 = document.getElementById('inp-3');
        sendButton3 = document.getElementById('btn-3');
        disconnectButton3 = document.getElementById('disconn-3');

        messageDiv = document.getElementById('messages');

        sendButton1.addEventListener('click', onSend1);
        sendButton2.addEventListener('click', onSend2);
        sendButton3.addEventListener('click', onSend3);

        disconnectButton1.addEventListener('click', onDisconnect1);
        disconnectButton2.addEventListener('click', onDisconnect2);
        disconnectButton3.addEventListener('click', onDisconnect3);

        input1.addEventListener('keyup', (event) => {
            if (event.key === 'Enter') {
                sendButton1.click();
            }
        })

        input2.addEventListener('keyup', (event) => {
            if (event.key === 'Enter') {
                sendButton2.click();
            }
        })

        input3.addEventListener('keyup', (event) => {
            if (event.key === 'Enter') {
                sendButton3.click();
            }
        })

        //scenario for two peers using single data channel using out-of-band negotiation using an agreed upon id
        peer1_2 = new RTCPeerConnection();
        channel1_2 = peer1_2.createDataChannel("chat", { negotiated: true, id: 1 });

        channel1_2.onmessage = function (event) {
            handleReceivedMessage('Peer 1 received: ' + event.data);
        }

        peer1_3 = new RTCPeerConnection();
        channel1_3 = peer1_3.createDataChannel("chat", { negotiated: true, id: 1 });
        channel1_3.onmessage = function (event) {
            handleReceivedMessage('Peer 1 received: ' + event.data);
        }


        peer2 = new RTCPeerConnection();
        channel2 = peer2.createDataChannel("chat", { negotiated: true, id: 1 });

        channel2.onmessage = function (event) {
            handleReceivedMessage('Peer 2 received: ' + event.data);
        }


        peer3 = new RTCPeerConnection();
        channel3 = peer3.createDataChannel("chat", { negotiated: true, id: 1 });

        channel3.onmessage = function (event) {
            handleReceivedMessage('Peer 3 received: ' + event.data);
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

        peer1_2.onicecandidate = function (event) {
            if (event.candidate) {
                peer2.addIceCandidate(event.candidate);
            }
        }

        peer1_3.onicecandidate = function (event) {
            if(event.candidate) {
                peer3.addIceCandidate(event.candidate);
            }
        }

        peer2.onicecandidate = function (event) {
            if (event.candidate) {
                peer1_2.addIceCandidate(event.candidate);
            }
        }

        peer3.onicecandidate = function (event) {
            if (event.candidate) {
                peer1_3.addIceCandidate(event.candidate);
            }
        }

        peer1_2.createOffer()
            .then(offer => peer1_2.setLocalDescription(offer))
            .then(() => peer2.setRemoteDescription(peer1_2.localDescription))
            .then(() => peer2.createAnswer())
            .then(answer => peer2.setLocalDescription(answer))
            .then(() => peer1_2.setRemoteDescription(peer2.localDescription))
            .catch(console.log);

        peer1_3.createOffer()
            .then(offer => peer1_3.setLocalDescription(offer))
            .then(() => peer3.setRemoteDescription(peer1_3.localDescription))
            .then(() => peer3.createAnswer())
            .then(answer => peer3.setLocalDescription(answer))
            .then(() => peer1_3.setRemoteDescription(peer3.localDescription))
            .catch(console.log);
    }

    function handleReceivedMessage(data) {
        const div = document.createElement('p');
        const msgNode = document.createTextNode(data);
        div.appendChild(msgNode);
        messageDiv.appendChild(div);
    }

    function onDisconnect1() {
        channel1_2.close();
        peer1_2.close();

        channel1_3.close();
        peer1_3.close();
    }

    function onDisconnect2() {
        channel2.close();
        peer2.close();
    }

    function onDisconnect3() {
        channel3.close();
        peer3.close();
    }

    function onSend1() {

        console.log('channel 1_2 ready state: ' + channel1_2.readyState);
        console.log('channel 1_3 ready state: ' + channel1_3.readyState);

        if (channel1_2.readyState === "open") {
            const message = input1.value;
            channel1_2.send(message);
        }

        if (channel1_3.readyState === "open") {
            const message = input1.value;
            channel1_3.send(message);
        }
    }

    function onSend2() {

        console.log('channel 2 ready state: ' + channel2.readyState);

        if (channel2.readyState === "open") {
            const message = input2.value;
            channel2.send(message);
        }
    }

    function onSend3() {

        console.log('channel 3 ready state: ' + channel3.readyState);

        if (channel3.readyState === "open") {
            const message = input3.value;
            channel3.send(message);
        }
    }

    window.addEventListener('load', startup);
})();