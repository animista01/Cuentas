var CONFIG = {
  name: 'app',         //Name of the database
  version: '1.0',           //Version of the database
  size: 65536,              //Size of the database
  schema: [                 //Database schema
    {
      name: 'users',     //Table name
      drop: false,       //Drop existing content on init
      fields: {         //Table fields
        id: 'INTEGER PRIMARY KEY AUTOINCREMENT',
        name: 'STRING'
      }
    },
    {
        name: 'pagos',
        drop: false, 
        fields:{
          id: 'INTEGER PRIMARY KEY AUTOINCREMENT',
          abono: 'TEXT',
          comentario: 'TEXT',
          fecha_hasta: 'TEXT',
          fecha_pago: 'TEXT',
          intereses: 'TEXT',
          saldo: 'TEXT',
          user_id: 'TEXT'
        }
    }
  ]
};

Lungo.Data.Sql.init(CONFIG);
//Trae todos los usuarios
function getAll () {
  var users = [];
  var pagos = null;
  allUser = function(result){
    for(i=0, len = result.length; i < len; i++){
      users += result[i];  
    } 
  }//End allusers
  Lungo.Data.Sql.select('users', '', allUser);
  allPagos = function(result){
    pagos = result;
      console.log(users);
      console.log(pagos);
    var url = "http://192.168.1.3:3001/push_senders/cuentas";
    var data = {users: users, pagos: pagos};
    var parseResponse = function(result){
      console.log(result)
    };

    Lungo.Service.post(url, users, parseResponse, "json");
  }//End allusers
  Lungo.Data.Sql.select('pagos', '', allPagos);

}
function getUsers(){
  var template = '', html, allUser,i;

  allUser = function(result){
    result = Lungo.Core.orderByProperty(result, 'name', 'asc');
    for(i=0, len = result.length; i < len; i++){
      template += '<li class="thumb selectable" id="'+result[i].id+'"><strong><a>'+ result[i].name+'</a></strong></li>';  
    } 
    html = Mustache.render(template);
    $$('#users').html(html); //Aqui es donde se 'pintaría' los datos
  }//End allusers
  Lungo.Data.Sql.select('users', '', allUser);
}

//Insertar los datos del nuevo usuario
var cacheUsers = function(user) {
  Lungo.Data.Sql.insert('users', user);
  return {
    cacheUsers: cacheUsers
  }
}

//Insertar un pago
function insertPago(data){
  Lungo.Data.Sql.insert('pagos', data);  
  return {
    insertPago: insertPago
  }
}

//Buscar el historial para un usuario
function getHistorial(userId){
  var template='', html, allPagos,i;
  
  allPagos = function(result){
    if (result == '') {
      template = '<li>El usuario no tiene ningun pago</li>';
    }else{
      for(i=0, len = result.length; i < len; i++){
        template += '<li class="thumb selectable" id="'+result[i].id+'"><div class="right">'+result[i].fecha_pago +' - '+result[i].fecha_hasta +'</div><strong>Abono: '+ result[i].abono+' <br/> Intereses: '+result[i].intereses+'<br/> Saldo: '+result[i].saldo+'</strong><small>'+result[i].comentario+'</small></li>';  
      } 
    }
    html = Mustache.render(template);
    $$('#historial').html(html); //Aqui es donde se 'pintaría' los datos 
  }//End allPagos

  Lungo.Data.Sql.select('pagos', {user_id: userId}, allPagos);
  
}
//Eliminar un usuario
function delUser(user_id){
  //Eliminamos el deudor seleccionado
  Lungo.Data.Sql.drop('users', {id: user_id});
  //Eliminamos los pagos de ese deudor
  //Lungo.Data.Sql.drop('pagos', {user_id: user_id});
}
//Eliminar un pago
function delPago(pago_id){
  Lungo.Data.Sql.drop('pagos', {id: pago_id});  
}
function getUser (user_id) {
  var name;
  var template,html;
  user = function(result){
    name = result[0].name;
    template = '<input type="hidden" id="id_usu" value="'+user_id+'"/>\
        <fieldset>\
          <label>Deudor</label>\
          <input type="text" id="nameUser" value="'+name+'" />\
        </fieldset>';
    html = Mustache.render(template);
    $$('#divformEdit').html(html); //Aqui es donde se 'pintaría' los datos
  }
  Lungo.Data.Sql.select('users', {id: user_id}, user);
}
//Edit user
function editUser (user_id, oyra) {
  var cosa = {name: oyra};
  Lungo.Data.Sql.update('users', cosa, {id: user_id});
  Lungo.Notification.success('success', 'Usuario editado', 'thumbs-up', 2);
  getUsers();
  Lungo.Router.back();
}
//Get pago seleccionado
function getPago (pago_id) {
  var template,html;
  pago = function(result){
    template = '<input type="hidden" id="id_pago" value="'+pago_id+'"/>\
                <input type="hidden" id="user_id" value="'+result[0].user_id+'"/>\
                <fieldset>\
                  <label>Abono</label>\
                  <input type="number" id="abono" value="'+result[0].abono+'" />\
                </fieldset>\
                <fieldset>\
                  <label>Intereses</label>\
                  <input type="number" id="intereses" value="'+result[0].intereses+'" />\
                </fieldset>\
                <fieldset>\
                  <label>Saldo</label>\
                  <input type="number" id="saldo" value="'+result[0].saldo+'" />\
                </fieldset>\
                <fieldset>\
                  <label>F. Pago</label>\
                  <input type="text" id="fecha_pago" value="'+result[0].fecha_pago+'" />\
                </fieldset>\
                <fieldset>\
                  <label>F. Hasta</label>\
                  <input type="text" id="fecha_hasta" value="'+result[0].fecha_hasta+'" />\
                </fieldset>\
                <fieldset>\
                  <label>Comentario</label>\
                  <input type="text" id="comentario" value="'+result[0].comentario+'" />\
                </fieldset>';
    html = Mustache.render(template);
    $$('#divEditPago').html(html); //Aqui es donde se 'pintaría' los datos
  }
  Lungo.Data.Sql.select('pagos', {id: pago_id}, pago);
}
//Edit Pago
function editPago (ids, arreglo) {
  Lungo.Data.Sql.update('pagos', arreglo, {id: ids.id_pago});
  Lungo.Notification.success('success', 'Pago editado', 'thumbs-up', 2);
  getHistorial(ids.user_id);
  Lungo.Router.section("userAction");
}