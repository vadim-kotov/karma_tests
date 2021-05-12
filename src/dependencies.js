function getExtraAttrsNames() { return true; };
window.TP_ALLOWED = true;
window.COMMENT_ALLOWED = true;
var constructNodeChildren = [];

function loadNodeTreeByUUID(uuid) { 
    var elems = {
        '7547c386-6c11-43ce-843f-42a39642cd1e': '{ "attributes": {"_type": { "key": "_type", "type": "STRING", "value": "Requirement" }}, "children": [ "648c2725-4db2-4ad1-8254-aaf4d1aa67fa", "f6c854e9-9058-4b36-a6dc-461b059969cf", "e23c5275-46c7-4e6f-8669-ee6d36f4003f", "450d5815-da17-404d-af93-0e75976ef961" ], "id": "Requirements", "uuid": "7547c386-6c11-43ce-843f-42a39642cd1e" }',
    };
    let result = uuid in elems ? elems[uuid] : null;
    return result;
};

function hideMenu() { return true; }

function getSelectedNode() { return null; }

function getParentUUID(uuid) { return null; }

function isNodeHeader(uuid) { return null; }