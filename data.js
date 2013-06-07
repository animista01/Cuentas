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
          abono: 'INTEGER',
          comentario: 'TEXT',
          fecha_hasta: 'DATETIME',
          fecha_pago: 'DATETIME',
          intereses: 'INTEGER',
          saldo: 'INTEGER',
          user_id: 'INTEGER'
        }
    }
  ]
};
Lungo.Data.Sql.init(CONFIG);


//Trae todos los usuarios
function getUsers(){
  var template='', html, allUser,i;

  allUser = function(result){
    for(i=0, len = result.length; i < len; i++){
      template += '<li class="thumb selectable" id="'+result[i].id+'"><strong><a href="#agregarPagoUsu" data-router="section">'+ result[i].name+'</a></strong></li>';  
    } 
    html = Mustache.render(template);
    $$('#users').html(html); //Aqui es donde se 'pintaría' los datos que estamos consumiendo en JSON  
  }//End allusers

  Lungo.Data.Sql.select('users', '', allUser);
}


//Insertar los datos del nuevo usuario
var cacheUsers = function(user) {
  Lungo.Data.Sql.insert('users', user);
}

return {
  cacheUsers: cacheUsers
}

//Insertar un pago

function insertPago(data){
  Lungo.Data.Sql.insert('pagos', data);  
}

return {
  insertPago: insertPago
}

function getHistorial(){
  var template='', html, allPagos,i;

  allPagos = function(result){
    for(i=0, len = result.length; i < len; i++){
      template += '<li id="'+result[i].id+'"><div class="right">'+result[i].fecha_pago +' - '+result[i].fecha_hasta +'</div><strong>Abono: '+ result[i].abono+' Intereses: '+result[i].intereses+' Saldo: '+result[i].saldo+'</strong><small>'+result[i].comentario+'</small></li>';  
    } 
    html = Mustache.render(template);
    $$('#ulhistorial').html(html); //Aqui es donde se 'pintaría' los datos que estamos consumiendo en JSON  
  }//End allPagos

  Lungo.Data.Sql.select('pagos', '', allPagos);
}