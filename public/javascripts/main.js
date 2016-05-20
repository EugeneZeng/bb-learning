//main.js
	var InvoiceItemModel = Backbone.Model.extend({
		calculateAmount:function(){
			if(this.get('price') && this.get('quantity')){
				return this.get('price') * this.get('quantity')
			} else {
				return 0;
			}
		}
	});
	var InvoiceItemCollection = Backbone.Collection.extend({
		model: InvoiceItemModel
	});
(function ($) {
	var InvoiceItemView = Backbone.View.extend({
		tagName: 'tr',
		renderViewMode: function(){
			var html = _.map([
					this.model.get('quantity'),
					this.model.get('description'),
					this.model.get('price'),
					this.model.calculateAmount(),
					'<button type="button" class="btn btn-default" name="edit">Edit</button>'
				], function(val, key){
				return '<td>'+ val +'</td>';
			});
			$(this.el).html(html);
			return this;
		},
		renderEditMode: function(){
			var html = _.map([
					'<input type="text" name="quantity" value="'+  
						this.model.get('quantity')
					+'" />',
					'<input type="text" name="description" value="'+  
						this.model.get('description')
					+'" />',
					'<input type="text" name="price" value="'+  
						this.model.get('price')
					+'" />',
					this.model.calculateAmount(),
					'<div class="btn-group" role="group"><button type="button" class="btn btn-default" name="save">Save</button><button type="button" class="btn btn-default" name="cancel">Cancel</button></div>',
				], function(val){
				return '<td>'+ val +'</td>';
			});
			$(this.el).html(html);
			return this;
		},
		renderCallback: 'renderViewMode',
		render:function(){
			return this[this.renderCallback]();
		},
		events: {
			"click button[name='edit']":"edit",
			"click button[name='save']":"save",
			"click button[name='cancel']":"cancel"
		},
		edit: function(){
			this.renderCallback = 'renderEditMode';
			this.render();
		},
		save: function(){
			var data = {};
			var $view = $(this.el);
			data.quantity = $view.find("input[name='quantity']").val();
			data.description = $view.find("input[name='description']").val();
			data.price = $view.find("input[name='price']").val();
			this.model.set(data);

			this.renderCallback = 'renderViewMode';
			this.render();
		},
		cancel: function(){
			this.renderCallback = 'renderViewMode';
			this.render();
		},
		destory: function(){
			this.remove();		
		},
		initialize: function () {
			this.listenTo(this.model, 'destory', this.destroy, this);		
		}
	});

	var InvoiceItemListView = Backbone.View.extend({
		tagName: 'table',
		className: 'table table-hover',
		render: function(){
			var headerStr = _.map([
					{'text':'Quantity', 'width':'100'}, {'text':'Description'}, {'text':'Price', 'width':'100'}, {'text':'Total', 'width':'100'}, {'text':'Operation', 'width':'200'}
				], function(item, key){
					var width = item.width ? ' width="'+ item.width +'"' : '';
					return '<th'+ width +'>'+ item.text +'</th>';
			});
			var _me = this;
			$(this.el).empty()
					.append('<tr></tr>')
					.html(headerStr);
			_.each(this.collection.models, function (model) {
					_me.append(model);		
			});
			return this;
		},
		append: function (model) {
			var modelEl = new InvoiceItemView({model: model}).render().el;
			this.$el.append(modelEl);
		},
		initialize: function () {
			this.listenTo(this.collection, 'add', this.append, this);		
			this.listenTo(this.collection, 'remove', this.render, this);				
		}
	});
	
	var InvoiceItemListControlView = Backbone.View.extend({
		template:_.template('<button type="button" class="btn btn-default" name="<%=name %>"><%=text %></button>'),
		render: function(){
			var btns = [
				{name: 'add', text: 'Add'},		
				{name: 'remove', text: 'Remove'},	
			];
			var _me = this;
			var html = _.map(btns, function(btn){
				return _me.template(btn);			
			});
			html = '<div class="btn-group" role="group">'+ html.join("") +'</div>';
			this.$el.html(html);
			return this;
		},
		events:{
			'click [name="add"]'	:'addNewInvoiceItem',
			'click [name="remove"]'	:'removeNewInvoiceItem'		
		},
		addNewInvoiceItem:function(){
			var description = prompt('Enter item description', '');
			var price = prompt('Enter item price', '0');
			var quantity = prompt('Enter item quantity', '1');
			
			this.collection.add([{
				description	: description,
				price		: price,
				quantity	: quantity
			}]);
		},
		removeNewInvoiceItem:function(){
			var position = prompt("Enter position to remove", '0');
			var model = this.collection.at(position);
			if(model){
				this.collection.remove(model);
			}
		}
	});

	var InvoiceItemListPageView = Backbone.View.extend({
		
		render:function(){
			var invoiceItemListView = new InvoiceItemListView({
				collection: this.collection
			});
			var invoiceItemListControlView = new InvoiceItemListControlView({
				collection: this.collection
			});
			$('#content').html(invoiceItemListView.render().el)
					.append(invoiceItemListControlView.render().el);
			
		}
	});


	var invoiceItemCollection = new InvoiceItemCollection([
			{ description: 'Wooden Toy House', price: 22, quantity: 3 },
			{ description: 'Farm Animal Set', price: 17, quantity: 2 },
			{ description: 'Farmer Figure', price: 8, quantity: 4 },
			{ description: 'Toy Tractor', price: 15, quantity: 6 }
		]);

	var invoiceItemListPageView = new InvoiceItemListPageView({
		collection: invoiceItemCollection
	});
	$(function(){
		invoiceItemListPageView.render();
	});
})(jQuery);

