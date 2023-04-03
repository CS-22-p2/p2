

function format_string(string) {
    return ((string.replace(/\d+/g, '')).trim()).toLowerCase();
}

function main() {
    let campus_addresses = ["selmalagerløfsvej", "bertil ohtils vej", "frederik bajers vej"];
    let b = "Selmalagerløfsvej 12";
    let a = format_string(b);
    if (campus_addresses.includes(a)) {
        console.log("Works");
    }
    else {
        console.log("Not works");
    }
}

main();
