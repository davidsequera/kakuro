import { re } from "mathjs";
import { findPermutations } from "../lib/utils";
import { StateMessage, ActionMessage } from "./Message";
import { BruteForcePlay } from "./MachineAlgorithms";

let win = false;

let tries = 0;

const LIMIT = 100000;


// Listen for messages from the worker
self.onmessage = (e) => {
    const response: StateMessage = e.data;
    win = response.state;
    if(!win && tries++ < LIMIT){
        postMessage(BruteForcePlay(e.data.board, e.data.types));
    }
};




