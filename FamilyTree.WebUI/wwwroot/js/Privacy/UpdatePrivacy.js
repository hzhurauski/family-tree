// Requests
async function UpdatePrivacy(privacy) {
    let result = await $.ajax({
        type: "PUT",
        data: privacy,
        url: "/Privacy/Update/" + privacy.Id
    });

    return result;
}