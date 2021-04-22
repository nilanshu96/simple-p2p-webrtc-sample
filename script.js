(function() {
    //peer 1
    let input1 = null;
    let sendButton1 = null;
    let disconnectButton1 = null;
    let div1 = null;
    let channel1 = null;
    let peer1 = null;

    //peer 2
    let input2 = null;
    let sendButton2 = null;
    let disconnectButton2 = null;
    let div2 = null;
    let channel2 = null;
    let peer2;

    function startup() {

        input1 = document.getElementById('inp-1');
        sendButton1 = document.getElementById('btn-1');
        disconnectButton1 = document.getElementById('disconn-1');
        div1 = document.getElementById('received-message1');

        input2 = document.getElementById('inp-1');
        sendButton2 = document.getElementById('btn-1');
        disconnectButton2 = document.getElementById('disconn-1');
        div2 = document.getElementById('received-message1');

        sendButton1.addEventListener('click', onSend1);
        sendButton2.addEventListener('click', onSend2);

        disconnectButton1.addEventListener('click', onDisconnect1);
        disconnectButton2.addEventListener('click', onDisconnect2);

        peer1 = new RTCPeerConnection();
        channel1 = peer1.createDataChannel("chat");
        // channel1.onMessage = function(event) {
        //     console.log('Peer 1 received: :' + event.data);
        // }
        

        peer2 = new RTCPeerConnection();
       
        

        peer1.onicecandidate = function(event) {
            if(event.candidate) {
                peer2.addIceCandidate(event.candidate)
                    .catch(console.log);
            }
        }

        peer2.onicecandidate = function(event) {
            if(event.candidate) {
                peer1.addIceCandidate(event.candidate)
                .catch(console.log);;
            }
        }

        peer2.ondatachannel = function(event) {
            console.log('ondatachannel')
            channel2 = event.channel;
            console.log(channel2.readyState);
            channel2.onmessage = function(event){
                console.log('Peer 2 received: :' + event.data);
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

    function onDisconnect1() {
        channel1.close();
        peer1.close();
    }

    function onDisconnect2() {
        channel2.close();
        peer2.close();
    }

    function onSend1() {
        if(channel1.readyState === "open") {
            const message = input1.value;
        channel1.send(message);
        }
    }

    function onSend2() {
        if(channel2.readyState === "open") {
            const message = input2.value;
        channel2.send(message);
        }
    }

    window.addEventListener('load', startup);
})();