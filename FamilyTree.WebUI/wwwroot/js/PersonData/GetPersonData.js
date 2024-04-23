export async function GetPersonData(personId) {
    return await $.ajax({
        method: "GET",
        dataType: "json",
        url: "/People/Get/" + personId
    });
}