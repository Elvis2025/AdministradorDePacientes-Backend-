const generarId = () =>{
    const random = Math.random().toString(32).substring(2);
    const dateNowR = Date.now().toString(32);

    const idRandom = random + dateNowR;

    return idRandom;
}

export default generarId;