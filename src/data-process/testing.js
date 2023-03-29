
function date() {
    const event_date = new Date('2023-3-30');
    const current_date = new Date();
    // getTime - gets time in milliseconds from your pc
    let difference_milliseconds = event_date.getTime() - current_date.getTime();
    let difference_days = Math.ceil(difference_milliseconds / (1000 * 3600 * 24));
    console.log(`DAYS BETWEEN: ${difference_days}`);
}
date();
