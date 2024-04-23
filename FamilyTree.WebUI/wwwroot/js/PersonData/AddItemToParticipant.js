import { FillParticipant } from "./FillParticipant.js";

export function AddItemToParticipant(participant) {
    let participantElement = document.createElement("div");
    participantElement.classList.add("participant");
    participantElement.classList.add(participant.IsOwner ? "owner__item" : "participants__item");
    participantElement.setAttribute("data-id", participant.Id);

        let imgElement = document.createElement("img");

        let selectorElement = document.createElement("div");
        selectorElement.classList.add("participant__selector");
        let checkboxElement = document.createElement("div");
        checkboxElement.classList.add("checkbox");
        let inputElement = document.createElement("input");
        inputElement.type = "checkbox";
        inputElement.disabled = participant.IsOwner;
        checkboxElement.appendChild(inputElement);
        selectorElement.appendChild(checkboxElement);

        let infoElement = document.createElement("div");
            let surnameElement = document.createElement("div");
            surnameElement.classList.add("surname");
            let nameElement = document.createElement("div");
            nameElement.classList.add("name");
            let middlenameElement = document.createElement("div");
            middlenameElement.classList.add("middlename");
            let birthdayElement = document.createElement("div");
            birthdayElement.classList.add("birthday");
        infoElement.classList.add("participant_info");
        infoElement.appendChild(surnameElement);
        infoElement.appendChild(nameElement);
        infoElement.appendChild(middlenameElement);
        infoElement.appendChild(birthdayElement);

    participantElement.appendChild(selectorElement);
    participantElement.appendChild(imgElement);
    participantElement.appendChild(infoElement);

    FillParticipant(participantElement, participant);

    $("#person-data-block")
        .find(".participants")[0]
        .appendChild(participantElement);
}