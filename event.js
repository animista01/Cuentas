Lungo.ready(function() {
	getUsers();
});

Lungo.dom('#main-article').on('load', function(){
	getUsers();   
});

$$('#all').tap(function () {
	getAll();
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

//Mostrar el historial del user y con el menu de acciones
$$('#users li').tap(function() {
	var user = Lungo.dom(this);
	var user_id = user.attr('id');
	var tempdos,html2;

	getHistorial(user_id);

	tempdos = '<nav>\
	            	<a href="#" id="'+user_id+'" data-action="agregar">\
						<span class="icon plus"></span>\
	            	</a>\
	            	<a href="#" id="'+user_id+'" data-action="editar">\
	            		<span class="icon pencil"></span>\
	            	</a>\
	            	<a href="#" id="'+user_id+'" class="red" data-action="eliminar">\
						<span class="icon remove"></span>\
	            	</a>\
	            </nav>';
	html2 = Mustache.render(tempdos);
    $$('#footerUserAction').html(html2); //Aqui es donde se 'pintaría' los datos   
    Lungo.Router.section('userAction');
});

//Cargar form de nuevo pago
$$('a[data-action=agregar]').tap(function(){
	var user = Lungo.dom(this);
	var user_id = user.attr('id');
	var template,html;

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

    footerAgregarPago();
    Lungo.Router.section('agregarPagoUsu');
}); 
//Footer para agregar un pago al user
function footerAgregarPago(){
	var tempdos,html2;
	tempdos = '<nav>\
            	<a href="#" data-action="guardar">\
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
	
	getHistorial(id_usu);
    Lungo.Router.back();
});

//Editar un Pago
$$('ul#historial li.thumb').tap(function(){
	var pago = Lungo.dom(this);
	var pago_id = pago.attr('id');
	getPago(pago_id);
    footerEditPago(pago_id);
    Lungo.Router.section('EditarPago');
});
function footerEditPago () {
	var tempdos,html2;
	tempdos = '<nav>\
            	<a href="#" data-action="saveEditPago">\
					<span class="icon check"></span>\
            	</a>\
            </nav>';
	html2 = Mustache.render(tempdos);
    $$('#footerEditPago').html(html2); //Aqui es donde se 'pintaría' los datos 
}
$$('a[data-action=saveEditPago]').tap(function(){
	var ids = {id_pago: Lungo.dom('#id_pago').val(), user_id: Lungo.dom('#user_id').val()};
	var arreglo = {abono: Lungo.dom('#abono').val(), comentario: Lungo.dom('#comentario').val(), fecha_hasta: Lungo.dom('#fecha_hasta').val(), fecha_pago: Lungo.dom('#fecha_pago').val(), intereses: Lungo.dom('#intereses').val(), saldo: Lungo.dom('#saldo').val()};
	editPago(ids, arreglo);
})
//Eliminar un Pago
$$('ul#historial li.thumb').hold(function(){
	console.log("hey"); 
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
//Eliminar a un deudor
$$('a[data-action=eliminar]').tap(function(){
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
//Editar a un usuario
$$('a[data-action=editar]').tap(function () {
	var user = Lungo.dom(this);
	var user_id = user.attr('id');
	getUser(user_id);
    footerEdit(user_id);
    Lungo.Router.section('EditarUser');
});
function footerEdit (user_id) {
	var tempdos,html2;
	tempdos = '<nav>\
            	<a href="#" id="'+user_id+'" data-action="saveEdit">\
					<span class="icon check"></span>\
            	</a>\
            </nav>';
	html2 = Mustache.render(tempdos);
    $$('#footerEdit').html(html2); //Aqui es donde se 'pintaría' los datos 
}
$$('a[data-action=saveEdit]').tap(function(){
	var id_usu = Lungo.dom('#id_usu').val();
	var name = Lungo.dom('#nameUser').val();
	editUser(id_usu, name);
});