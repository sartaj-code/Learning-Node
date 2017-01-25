
function process_step1(params) {

    // do some stuff

    process.nextTick(process_step2);
}

function process_step2(params) {

    // do some stuff

    process.nextTick(process_step3);
}

function process_step2(params) {

    // do some stuff

}