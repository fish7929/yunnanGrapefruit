var storage = window.localStorage;
function setData(key, value){
	storage.setItem(key, value);
}
function getData(key){
	return storage.getItem(key);
}
function updateData(itme, value){
	storage.setItem(itme, value);
}
function removeData(key){
	storage.removeItem(key);
}
function clearData(){
	storage.clear();
}

function showStorage (){
	var len = storage.length;
	if (len != 0){
		for(var i = 0; i < len; i++){
			//key(i)�����Ӧ�ļ�������getItem()������ö�Ӧ��ֵ
			alert(storage.key(i)+ " : " + storage.getItem(storage.key(i)) + "<br>");
		}
	}else{
		alert("storage Ϊ�գ�");
	}
}