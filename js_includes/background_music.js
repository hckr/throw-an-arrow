let audioCtx = new AudioContext(),
    source = audioCtx.createBufferSource(),
    byteString = atob('#base64{assets/sounds/background.ogg}'),
    ia = new Uint8Array(byteString.length),
    gainNode = audioCtx.createGain();

for (let i = 0; i < byteString.length; ++i) {
    ia[i] = byteString.charCodeAt(i);
}

gainNode.connect(audioCtx.destination);

audioCtx.decodeAudioData(ia.buffer, function(buffer) {
   source.buffer = buffer;
   source.connect(gainNode);
   source.loop = true;
   source.start(0);
});

function muteBackgroundMusic() {
    gainNode.gain.setValueAtTime(0, 0);
}

function unmuteBackgroundMusic() {
    gainNode.gain.setValueAtTime(1, 0);
}
