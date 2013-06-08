Lungo.ready(function() {
	getUsers();
});

Lungo.dom('#main-article').on('load', function(){
	getUsers();   
});

//Crear un nuevo deudor
$$('#aCrearUsu').tap(function() {
	var name = Lungo.dom('#nombreUsu').val();
	var datos = {name: name}
	if (name) {
		cacheUsers(datos);
		Lungo.dom('#nombreUsu').val('');
		Lungo.Notification.success('success', 'Usuario creado :)', 'thumbs-up', 2);
		// Si todo fue correcto cargamos la seccion principal, usando Router
        Lungo.Router.article("main","main-article");
	}
});

//Traer todos los deudores
$$('ul#users li').tap(function() {
	var template,html;
	var user = Lungo.dom(this);
	var user_id = user.attr('id');

	template = '<input type="hidden" id="id_usu" value="'+user_id+'"/>\
				<fieldset>\
					<label>F. Pago</label>\
                    <input type="number" id="fechapago" />\
                </fieldset>\
                <fieldset data-icon="mail">\
                	<label>F. Hasta</label>\
                    <input type="number" id="hastapago" />\
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
                </fieldset>';
    html = Mustache.render(template);
    $$('#divform').html(html); //Aqui es donde se 'pintaría' los datos

    footerPago(user_id);
});

function footerPago(user_id){
	var tempdos,html2;
	tempdos = '<nav>\
	            	<a href="#" id="'+user_id+'" class="active">\
	            		<span class="icon remove"></span>\
	            	</a>\
	            	<a href="#" class="" data-action="guardar">\
						<span class="icon check"></span>\
	            	</a>\
	            </nav>';
	html2 = Mustache.render(tempdos);
    $$('#footerPago').html(html2); //Aqui es donde se 'pintaría' los datos   
}

//Guardar un pago a un deudor
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

//Traer todos los deudores para sacarle su historial de pagos
$$('#historial-article').on('load', function() {
	getUserHistorial();   
});
//Historial del deudores seleccionado
$$('ul#ulhistorial li').tap(function(){
	var user = Lungo.dom(this);
	var user_id = user.attr('id');
	getHistorial(user_id);   
});

//Preguntar si quiere o no eliminar un pago de un deudor
$$('ul#historial li').tap(function(){
	var pago = Lungo.dom(this);
	var pago_id = pago.attr('id');

	Lungo.Notification.confirm({
	    icon: 'remove',
	    title: 'Eliminar',
	    description: 'Eliminar este pago?',
	    accept: {
	        icon: 'checkmark',
	        label: 'Si',
	        callback: function(){ 
	        	delPago(pago_id);
	        	Lungo.Router.article("main","historial-article");
	    	}
	    },
	    cancel: {
	        icon: 'close',
	        label: 'No',
	        callback: function(){}
	    }
	});  
});

$$('footer#footerPago nav a.active').tap(function(){
	var deudor = Lungo.dom(this);
	var deudor_id = deudor.attr('id');

	Lungo.Notification.confirm({
	    icon: 'remove',
	    title: 'Eliminar',
	    description: 'Eliminar este deudor?',
	    accept: {
	        icon: 'checkmark',
	        label: 'Si',
	        callback: function(){ 
	        	delUser(deudor_id);
	        	Lungo.Router.article("main","main-article");
	    	}
	    },
	    cancel: {
	        icon: 'close',
	        label: 'No',
	        callback: function(){}
	    }
	});
	
});
