
// Definicion del modelo Favorito:

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Favourite',
      { userId: {//author ---.- user
            type: DataTypes.INTEGER,
            validate: {
                notEmpty: { msg: "El campo authorId no puede estar vacío" }
            }
        },
        postId: {
            type: DataTypes.INTEGER,
            validate: {
                notEmpty: { msg: "El campo postId no puede estar vacío" }
            }
        }//,

       /* best: {
               //Habría que añadir BEST para puntuar
        }*/  
      });
}