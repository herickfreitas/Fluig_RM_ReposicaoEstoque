function displayFields(form,customHTML){ 

	
	// Fields
	var codcoligada = form.getValue("CodColigada"); 
	var idmov = form.getValue("IdMov");
	var idFluig = getValue('WKNumProces');
	form.setValue("IdentificadorFluig", idFluig);
	var fields = new Array(codcoligada, idmov, idFluig);
	log.info("displayFields:"+ fields);
	
	
	var activity = getValue('WKNumState');
	var designador = 109;
	log.info("displayFields WKNumState "+activity);
	
	/* Controlando exibição da div para seleção do Comprador */
	customHTML.append("<script>");
	customHTML.append("$(document).ready(function(){ "); 
	
	if (activity != designador)  {
		customHTML.append("$('#dvComprador').hide();");
		form.setShowDisabledFields(true);
	}
	else {
		customHTML.append("$('#dvComprador').show();");
	}
	customHTML.append(" });");
	customHTML.append("</script>");
	
}