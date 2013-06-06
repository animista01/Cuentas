Lungo.ready(function() {
	allUser();
});

Lungo.dom('#main-article').on('load', function(){
	allUser();
	var template,html;
    template ='<li>Usuario</li>\
                    <li class="anchor"></li>\
                    <ul>{{#allUser}}\
                     <li class="thumb selectable" id="{{id}}">\
                        <strong>{{name}}</strong>\
                    </li>\
                    {{/allUser}}</ul>';
        html = Mustache.render(template,result);
        $$('#main-article').html(html); //Aqui es donde se 'pintaría' los datos que estamos consumiendo en JSON
});

$$('#aCrearUsu').tap(function() {
	var name = Lungo.dom('#nombreUsu').val();
	var datos = {name: name}
	if (name) {
		cacheUsers(datos);
		Lungo.Notification.success('success', 'Usuario creado :)', 'thumbs-up', 3);
	}
});
