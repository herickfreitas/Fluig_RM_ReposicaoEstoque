var SeqAtualizaWf = 105;
var SeqCancelaMov = 16;
var SeqFaturaMov = 22;
var SeqConcluiMov = 24;
var SeqGestorGSP = 55;
var SeqGestorDA = 36;

function beforeStateEntry(sequenceId){

	log.info("beforeStateEntry "+sequenceId);
	
	//Define Respons?vel
    if (sequenceId == SeqAtualizaWf) {
    	atualizaEtapaWorkflow();
    }
    else if (sequenceId == SeqGestorGSP) {
    	anexaDocumentos();    	
    }
    else if (sequenceId == SeqGestorDA) {
    	campoComplementarLink();
    }
    else 
		// De acordo com os estados finais ? passada a a??o a ser realizada no Movimento
	    if (sequenceId == SeqCancelaMov)
	    	AtualizaMovimento("Cancela");
		else if (sequenceId == SeqConcluiMov)
			AtualizaMovimento("Conclui");
		else if (sequenceId == SeqFaturaMov)
			AtualizaMovimento("Fatura");
	    
}

function AtualizaMovimento(acaoMovimento){
	try 
	{		
		log.info("AtualizaMovimento: "+acaoMovimento);
		
		var codColigada = hAPI.getCardValue("CodColigada"); 
		var idMov = hAPI.getCardValue("IdMov");
		var idFluig = getValue('WKNumProces');
		
		var cCompany = DatasetFactory.createConstraint("companyId", getValue("WKCompany"), getValue("WKCompany"), ConstraintType.MUST);	
		log.info("cCompany: "+getValue("WKCompany"));
		var cUser = DatasetFactory.createConstraint("colleagueId", getValue("WKUser"), getValue("WKUser"), ConstraintType.MUST);	
		log.info("cUser: "+getValue("WKUser"));
		var constraintsEmail = new Array(cCompany, cUser);
		var colleague = DatasetFactory.getDataset("colleague", null, constraintsEmail, null);
		
		var Email = colleague.getValue(0, "mail");
		
		// Passa as chaves do Movimento e o servi?o que dever? ser chamado.
		var fields = new Array(codColigada, idMov, acaoMovimento , Email, idFluig);
		
		log.info("Passou: "+acaoMovimento);
		
		var dsServiceMov = DatasetFactory.getDataset("wsDataSetServiceMov", fields, null, null);	
		
		if(dsServiceMov.getColumnsName()[0] == "ERROR"){
			throw dsServiceMov.getValue(0, "ERROR");
		}
			
		log.info("Retorno Dataset: AtualizaMovimento: "+ dsServiceMov);
	}
	catch (e)
	{
		log.error(e);
		throw e;
	}	
}

function campoComplementarLink() {
	try{

		/////////////////////////////////////////////////////////
	  	//			Inserindo LINK no campo complementar	   //
	  	/////////////////////////////////////////////////////////
		
		var IDMOV 		= hAPI.getCardValue("IdMov");
		var HOSTNAME 	= hAPI.getCardValue("hostname");
		var IDFLUIG 	= getValue('WKNumProces');
		var LINK  		= HOSTNAME+"/portal/p/CNC/pageworkflowview?app_ecm_workflowview_detailsProcessInstanceID="+IDFLUIG;
		
		log.info("==========[ campoComplementarLink ENTROU!! ]========== ");
		log.info("==========[ Inserindo link IDMOV ]========== " + IDMOV);
		log.info("==========[ Inserindo link HOSTNAME ]========== " + HOSTNAME);
		log.info("==========[ Inserindo link IDFLUIG ]========== " + IDFLUIG);
		log.info("==========[ Inserindo link LINK ]========== " + LINK);
		
		
		// Preparacao de chamada para o Dataset
		var arr01 = DatasetFactory.createConstraint("IDMOV", IDMOV, IDMOV, ConstraintType.MUST);
		var arr02 = DatasetFactory.createConstraint("LINK", LINK, LINK, ConstraintType.MUST);
		
		var constraints = new Array(arr01,arr02);
		log.info("==========[ campoComplementarLink createDataset constraints ]========== " + constraints);
		
		// Executando chamada do Dataset, salvo que para este n??o h?? retorno.
		DatasetFactory.getDataset("_RM_TMOV_LINKFLUIG", null, constraints, null);

	}
	
	catch (e)
	{
		log.error(e);
		throw e;
	}
}



function anexaDocumentos(){
	try {
		log.info("==========[ anexaDocumentos ENTROU ]==========");
		
	  	///////////////////////////////////////////////////
	  	//			CRIANDO LISTA COM DOC. ANEXADOS      //
	  	///////////////////////////////////////////////////

		var attachments = hAPI.listAttachments(); // Retorna a lista de anexos do processo.
		var listaDocumentos = [];
		if (attachments != "") {
			for (var i = 0; i < attachments.size(); i++) {
				var attachment = attachments.get(i);
				var adicionar = listaDocumentos.push(attachment.getDocumentId());
			}
		} 
		
		log.info("==========[ anexaDocumentos listaDocumentos ]==========" + listaDocumentos);

		
		
		
		var idMov = hAPI.getCardValue("IdMov");
		log.info("==========[ anexaDocumentos idMov ]=========="+idMov);
		
		// Rastreando movimentos
		var consultaRastreio = DatasetFactory.createConstraint("IDMOV", idMov, idMov, ConstraintType.MUST);
		var constraints = new Array(consultaRastreio);
		log.info("==========[ anexaDocumentos createDataset constraints ]========== " + constraints);	
		
		// coleta dados do dataset, utlizando filtro
		var datasetRastreio = DatasetFactory.getDataset("_RM_RASTREIAMOVIMENTOS", null, constraints, null);
		log.info("==========[ anexaDocumentos createDataset datasetRastreio ] ========== " + datasetRastreio);	 
		
		// Consultando a quantidade de arquivos retornados
		var quantMovimento   = datasetRastreio.rowsCount;
		log.info("==========[ anexaDocumentos quantidade ]========== " + quantMovimento);
		
		// Retirando o campo do resultado
		var e;
		for (e = 0; e < quantMovimento ; e++){
			log.info("==========[ for rastreamento entrou ]========== ");
			var movimento = datasetRastreio.getValue(e, "IDMOV");
			log.info("==========[ for rastreamento movimento ]========== " + movimento);
			
			//Iniciando coleta para o la??o que ir?? inserir os documentos de cada movimento
			var doc1 = DatasetFactory.createConstraint("IDMOV", movimento, movimento, ConstraintType.MUST);
			var constraints = new Array(doc1);
			log.info("==========[ anexaDocumentos createDataset constraints ]========== " + constraints);
				    
			// coleta dados do dataset, utlizando filtro
			var datasetDocumento = DatasetFactory.getDataset("_RM_GED_TMOV", null, constraints, null);
			log.info("==========[ anexaDocumentos createDataset datasetReturned ] ========== " + datasetDocumento);	 
			
			// Consultando a quantidade de arquivos retornados
			var quant   = datasetDocumento.rowsCount;
			log.info("==========[ anexaDocumentos quant ]========== " + quant);
			
			//Retirando o campo do resultado
			var i;
			for (i = 0; i < quant ; i++){
				log.info("==========[ anexaDocumentos FOR entrou ]========== ");
				var documentId = datasetDocumento.getValue(i, "CODDOCUMENTO");
				log.info("==========[ anexaDocumentos documentId ]========== " + documentId);
				
				var existeDoc = false;
				
				var d;
				for (d = 0; d <  listaDocumentos.length; d++) {
					 var documento = listaDocumentos[d];
					 if (documento == documentId) {
						 var existeDoc = true;
					 }
					 else {
						 continue;
					 }
				}
					

				if (listaDocumentos == "" || existeDoc == false ) { // Quando n??o exitir nada ou n??o existir o documento o mesmo ser?? anexado 
					log.info("==========[ anexaDocumentos if item ENTROU listaDocumentos ]========== " + listaDocumentos);
					log.info("==========[ anexaDocumentos if item ENTROU documentId ]========== " + documentId);
					log.info("==========[ anexaDocumentos if item ENTROU existeDoc ]========== " + existeDoc);
					
					hAPI.attachDocument(documentId); // Comando para inserir documentos em anexo ao formul??rio.
					
				}
				else {
					continue;
				}
			}
			
			
			}		
	}
	
	catch (e)
	{
		log.error(e);
		throw e;
	}
}



function atualizaEtapaWorkflow(){
	try {
		
	  	//////////////////////////////////////////////////
	  	//			CHEFE DO SOLICITANTE	     		//
	  	//////////////////////////////////////////////////
		
		log.info("==========[ atualizaEtapaWorkflow ENTROU ]==========");
		
		var processo = getValue("WKNumProces");     //Recupera o numero da solicita????o
		var requisitante = getValue("WKUser");		//Recupera o usu??rio corrente associado a atividade
			
		hAPI.setCardValue("n_solicitacao", processo);
		hAPI.setCardValue("solicitante", requisitante);
		    
		// Preparacao de filtro para consulta
		var c1 = DatasetFactory.createConstraint("SOLICITANTE", requisitante, requisitante, ConstraintType.MUST);
		var constraints = new Array(c1);
		log.info("==========[ atualizaEtapaWorkflow createDataset constraints ]========== " + constraints);
			    
		// coleta dados do dataset, utlizando filtro
		var datasetReturned = DatasetFactory.getDataset("_RM_SOLICITANTE_CHEFIA", null, constraints, null);
		log.info("==========[ atualizaEtapaWorkflow createDataset datasetReturned ] ========== " + datasetReturned);	  
			    
		// Gravando valores de retorno
		var retorno = datasetReturned.values;
		log.info("==========[ atualizaEtapaWorkflow createDataset dataset ]========== " + retorno);
			
		// Retirando o campo do resultado
		var chefe = datasetReturned.getValue(0, "CHEFIA");
		log.info("==========[ atualizaEtapaWorkflow createDataset chefe ]========== " + chefe);
			
		// Gravando retorno		
		hAPI.setCardValue("chefia", chefe);
		
		
		}
	
	catch (e)
	{
		log.error(e);
		throw e;
	}
}