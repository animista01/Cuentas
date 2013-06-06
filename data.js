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
            user_id: 'INTEGER',
            fecha_pago: 'DATETIME',
            fecha_hasta: 'DATETIME',
            intereses: 'INTEGER',
            abono: 'INTEGER',
            saldo: 'INTEGER',
            comentario: 'TEXT'
        }
    }
  ]
};
Lungo.Data.Sql.init(CONFIG);

//Trae todos los usuarios
var allUser = function(){
  Lungo.Data.Sql.select('users', '', function(result){
    console.log(result);

    var template,html;

    //Mostrar la info recibida
    template ='<li>Usuarios</li>\
                    <li class="anchor"></li>\
                    <ul>\
                     <li class="thumb selectable" id="{{id}}">\
                        <strong>{{name}}</strong>\
                    </li>\
                    </ul>';
        html = Mustache.render(template,result);
        $$('#main-article').html(html); //Aqui es donde se 'pintaría' los datos que estamos consumiendo en JSON
  });
}


//Insertar los datos del nuevo usuario
var cacheUsers = function(user) {
  Lungo.Data.Sql.insert('users', user);
}

return {
  cacheUsers: cacheUsers
}
