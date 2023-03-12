let dictionary;
let worker;

onmessage = (event) => {
    if(event.data.dictionary) {
        dictionary = event.data.dictionary;
    }
    if(event.data.board) {
        if(worker) {
            worker.terminate();
        }
        worker = new Worker(new URL('./worker-word-finder.js', import.meta.url));
        worker.postMessage({ board: event.data.board, dictionary: dictionary });
        worker.onmessage = (event) => {
            postMessage(event.data);
        }
    }
}
