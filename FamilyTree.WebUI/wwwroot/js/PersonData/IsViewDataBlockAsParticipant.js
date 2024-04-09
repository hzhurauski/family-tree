export function IsViewDataBlockAsParticipant() {
    return window.g_currentDataBlockParticipants && window.g_currentDataBlockParticipants.filter(x => !x.IsOwner).map(x => x.Id).indexOf(window.g_currentPerson.Id) >= 0;
}