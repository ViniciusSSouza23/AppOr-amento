// @ts-nocheck
class Despesa {
	constructor(ano, mes, dia, tipo, descricao, valor) {
		this.ano = ano;
		this.mes = mes;
		this.dia = dia;
		this.tipo = tipo;
		this.descricao = descricao;
		this.valor = valor;
	}

	validarDados() {
		for(let i in this) {
			if(this[i] == undefined || this[i] == '' || this[i] == null) {
				return false;
			}
		}
		return true;
	}
}

class Bd {

	constructor() {
		let id = localStorage.getItem('id');

		if(id === null) {
			localStorage.setItem('id', 0);
		}
	}

	getProximoId() {
		let proximoId = localStorage.getItem('id');
		return parseInt(proximoId) + 1;
	}

	gravar(d) {
		let id = this.getProximoId();

		localStorage.setItem(id, JSON.stringify(d));

		localStorage.setItem('id', id);
	}
	recuperaTodososRegistros()
	{
		let despesas= Array();
		 let id=localStorage.getItem('id');
		for(let i=1; i<= id; i++)
		{
			let despesa = JSON.parse( localStorage.getItem(i));
			if(despesa===null)
			{
				continue;
			}
			despesa.id=i;
			despesas.push(despesa);
		}
		
		return despesas;
	}
	pesquisar(despesa)
	{
		
		let despesasfiltradas=Array();
		despesasfiltradas=this.recuperaTodososRegistros();


		//verificando ano
		if(despesa.ano!='')
		{
			despesasfiltradas = despesasfiltradas.filter( d=>d.ano==despesa.ano);
			
		}
		// verificando mês
		if(despesa.mes!='')
		{
			despesasfiltradas= despesasfiltradas.filter(d=>d.mes==despesa.mes);
			
		}
		//verificando dia
		if(despesa.dia!='')
		{
			despesasfiltradas=despesasfiltradas.filter(d=>d.dia==despesa.dia);
			
		}
		//verificando tipo
		if(despesa.tipo!='')
		{
			despesasfiltradas=despesasfiltradas.filter(d=>d.tipo==despesa.tipo);
			
		}
		//verificando descricao
		if(despesa.descricao!='')
		{
			despesasfiltradas=despesasfiltradas.filter(d=>d.descricao==despesa.descricao);
			
		}
		//verificando valor
		if(despesa.valor!='')
		{
			despesasfiltradas=despesasfiltradas.filter(d=>d.valor==despesa.valor);
			
		}
		return despesasfiltradas;
	}
	remover(id)
	{
		localStorage.removeItem(id);
		
	}
}

let bd = new Bd();


function cadastrarDespesa() {

	let ano = document.getElementById('ano');
	let mes = document.getElementById('mes');
	let dia = document.getElementById('dia');
	let tipo = document.getElementById('tipo');
	let descricao = document.getElementById('descricao');
	let valor = document.getElementById('valor');

	let despesa = new Despesa(
		// @ts-ignore
		ano.value, 
		mes.value, 
		dia.value, 
		tipo.value, 
		descricao.value,
		valor.value
	);

	if(despesa.validarDados()) {
		bd.gravar(despesa)
		//dialog de sucesso
		document.getElementById('modal_titulo').innerHTML='Registro Gravado com sucesso';
		document.getElementById('modal_titulo_div').className="modal-header text-success";
		document.getElementById('modal_conteudo').innerHTML='Despesa foi cadastrada com sucesso!';
		document.getElementById('button_modal').innerHTML='Confirmar';
		document.getElementById('button_modal').className="btn btn-success";
		$('#erroGravacao').modal('show') ;

		//limpando campos
		ano.value ='';
		mes.value='';
		dia.value='';
		tipo.value='';
		descricao.value='';
		valor.value='';
	} else {
		document.getElementById('modal_titulo').innerHTML='Todos os campos precisam ser preenchidos!';
		document.getElementById('modal_titulo_div').className="modal-header text-danger";
		document.getElementById('modal_conteudo').innerHTML='Veja se todos os campos estão preenchidos.';
		document.getElementById('button_modal').innerHTML='Voltar';
		document.getElementById('button_modal').className="btn btn-danger";
		//dialog de sucesso
		$('#erroGravacao').modal('show') ;
	}
}

function CarregaListaDespesas(despesas=Array(), filtro=false)
{
	if(despesas.length==0&& filtro==false)
	{
		despesas = bd.recuperaTodososRegistros();
		
	}
	
	

	let listaDespesas= document.getElementById('listaDespesas');
	listaDespesas.innerHTML='';


	despesas.forEach(function(d){
		//criando linha
		let linha = listaDespesas.insertRow();
		//criando colunas
		linha.insertCell(0).innerHTML= `${d.dia} / ${d.mes}/ ${d.ano}` ;
		
		//colocando descrição do tipo.
		switch(d.tipo)
		{
			case '1':
			{
				d.tipo='Alimentação'; 
				break;
			}
			case '2': 
			{
				d.tipo = 'Educação';
				break;
			}
			case '3': 
			{
				d.tipo = 'Lazer';
				break;
			}
			case '4': 
			{
				d.tipo = 'Saúde';
				break;
			}
			case '5': 
			{
				d.tipo = 'Transporte';
				break;
			}
		}
		linha.insertCell(1).innerHTML=d.tipo;
		linha.insertCell(2).innerHTML=d.descricao;
		linha.insertCell(3).innerHTML=d.valor;

		//criando botão de exclusão

		let btn = document.createElement('button');
		btn.className='btn btn-danger';
		
		btn.innerHTML='<i class= "fas fa-times"></i>';
		btn.id='id_despesa_'+d.id;
		btn.onclick=function(){
			let id = this.id.replace('id_despesa_','');
			bd.remover(id);
			window.location.reload();
		};
		linha.insertCell(4).append(btn);
		

	});
	
}

function PesquisarDespesa()
{
	
	let ano= document.getElementById('ano').value;
	let mes= document.getElementById('mes').value;
	let dia= document.getElementById('dia').value;
	let tipo= document.getElementById('tipo').value;
	let descricao= document.getElementById('descricao').value;
	let valor= document.getElementById('valor').value;

	let despesa = new Despesa(ano,mes,dia,tipo,descricao,valor);

	let despesas = bd.pesquisar(despesa);

	CarregaListaDespesas(despesas,true);

}