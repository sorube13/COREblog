var models = require('../models/models.js');

exports.load = function(req, res, next, id) {

	models.Favourite
		.find({where: {id: Number(id)}})
		.success(function(post) {
			if(post){
				req.favourite = favourite;
				next();
			} else {
				req.flash('error', 'No existe el favorito con id '+ id+'.');
				next();
			}
		})
		.error(function(error) {
			next(error);
		});
};


exports.index = function(req, res, next) {
	
	models.Favourite
		.findAll({where: { userId: req.user.id},
									//best: /*[4, 5]*/},
							offset: req.pagination.offset,
							limit: req.pagination.limit})
		.success(function(favourites){

			var postIds = favourites.map(function(favourite) {
				return favourite.postId;
			});

			var where_value_patch;
			if(postIds.length == 0){
				where_value_patch= '"Posts"."id" in (NULL)';
			} else {
				where_value_patch= '"Posts"."id" in (' + postIds.join(',') + ')';
			}

			models.Post 
				.findAll({order:'updatedAt DESC',
							where: where_value_patch,
							include: [ { model: models.User, as: 'Author'}, models.Favourite]
				})
				.success(function(posts){

					var fc = require('./favourite_controller.js');

					for(var i in posts) {
						//posts[i].stars = fc.starsHtml(req, res, posts[i], req.url);
					}

					res.render('favourites/index',{
						posts: posts
					});
				})
				.error(function(error){
					next(error);
				});
		});
}

exports.add = function(req, res, next){
	models.Favourite.findOrCreate(
        { userId: req.session.user.id,
          postId: req.post.id
        })
		.success(function(){
			req.flash('success', 'Favorito creado con éxito.');
			res.redirect('/posts/'+req.post.id);
		})
		.error(function(error){
			next(error);
		});


	//var newbest = req.body.best || 0;
	//console.log("BEST = " + newbest);
};

exports.del = function(req, res, next){
	models.Favourite.find({where: {userId: req.session.user.id, 
									postId: req.post.id}})
		.success(function(favourites){
			console.log("favourites es "+favourites);
			if(favourites){
				favourites.destroy()
				.success(function(){
					req.flash('success', 'Favorito eliminado con éxito.');
	            	res.redirect('/posts/' + req.post.id );
				})
				.error(function(error) {
           			 next(error);
       			});
			}
			else{
				req.flash('info', 'Ese post no es favorito.');
	            res.redirect('/posts/' + req.post.id );
			}
			

	})
	.error(function(error) {
			console.log("No existe fap")
            next(error);
        });
};