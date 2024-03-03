import authService from '../api-authorization/AuthorizeService'

var populateTreeData = async ()  => {
    const token = await authService.getAccessToken();
    const response = await fetch('FamilyTree', {
        headers: !token ? {} : { 'Authorization': `Bearer ${token}` }
    });
    const data = await response.json();
    return data
}

var createNewTree = async (treeName)  => {
    const token = await authService.getAccessToken();
    var link = `FamilyTree/Create`
    var payload = { name: treeName } 
    await fetch(link, {
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        method: 'POST',
        body: JSON.stringify(payload)
    });
}

export { populateTreeData, createNewTree }