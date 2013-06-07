Lungo.ready(function() {
	getUsers();
});

Lungo.dom('#main-article').on('load', function(){
	getUsers();   
});

$$('#aCrearUsu').tap(function() {
	var name = Lungo.dom('#nombreUsu').val();
	var datos = {name: name}
	if (name) {
		cacheUsers(datos);
		Lungo.dom('#nombreUsu').val('');
		Lungo.Notification.success('success', 'Usuario creado :)', 'thumbs-up', 2);
		// Si todo fue correcto cargamos la seccion principal, usando Router

		//No funciona el Router al main-article :(
        Lungo.Router.article("main-article");
	}
});

$$('ul#users li').tap(function() {
	var template,html;
	var user = Lungo.dom(this);
	var user_id = user.attr('id');
	
	template = '<input type="hidden" id="id_usu" value="'+user_id+'"/>\
				<fieldset>\
					<label>Fecha del Pago:</label>\
                    <input type="date" id="fechapago" />\
                </fieldset>\
                <fieldset data-icon="mail">\
                	<label>Fecha Hasta:</label>\
                    <input type="date" id="hastapago" />\
                </fieldset>\
                <fieldset>\
                    <input type="number" id="interes" placeholder="Intereses" />\
                </fieldset>\
                <fieldset>\
                    <input type="number" id="abono" placeholder="Abono" />\
                </fieldset>\
                <fieldset>\
                    <input type="number" id="saldo" placeholder="Saldo" />\
                </fieldset>\
                <fieldset>\
                    <textarea name="comentario" id="comentario" placeholder="Comentario"></textarea>\
                </fieldset>\
	                <a href="#" class="button anchor" data-action="guardar">Guardar</a>';
    html = Mustache.render(template);
    $$('#divform').html(html); //Aqui es donde se 'pintaría' los datos que estamos consumiendo en JSON
});
$$('a[data-action=guardar]').tap(function() {
	var id_usu = Lungo.dom('#id_usu').val();
	var fechapago = Lungo.dom('#fechapago').val();
	var hastapago = Lungo.dom('#hastapago').val();
	var interes = Lungo.dom('#interes').val();
	var abono = Lungo.dom('#abono').val();
	var saldo = Lungo.dom('#saldo').val();
	var comentario = Lungo.dom('#comentario').val();

	var info = {abono: abono, comentario: comentario, fecha_hasta: hastapago, fecha_pago: fechapago, intereses: interes, saldo: saldo, user_id: id_usu};
	//Llamamos la funcion que inserta en la DB
	insertPago(info);
	//Limpiamos los campos
	Lungo.dom('#hastapago').val('');
    Lungo.dom('#fechapago').val('');
    Lungo.dom('#interes').val('');
    Lungo.dom('#abono').val('');
    Lungo.dom('#saldo').val('');
    Lungo.dom('#comentario').val('');

	Lungo.Notification.success('success', 'Pago Guardado :)', 'thumbs-up', 2);
	// Si todo fue correcto cargamos la seccion principal, usando Router
    Lungo.Router.back();
});

//Historial
$$('#historial-article').on('load', function() {
	getHistorial();
});
