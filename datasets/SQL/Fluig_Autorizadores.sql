USE [corporerm]
GO

/****** Object:  UserDefinedFunction [dbo].[Fluig_Autorizadores]    Script Date: 26/04/2021 19:15:02 ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO



/* funcao retorna o autorizador da Gesta da CNC, conforme o centro de custo informado. */

CREATE FUNCTION [dbo].[Fluig_Autorizadores]  

( @CENTROCUSTO AS VARCHAR(17)) 

RETURNS varchar(17) 
AS

    BEGIN  
		
		DECLARE @Retorno AS VARCHAR(17)
	
		-- Atribuido valor na vari�vel autorizador, para preenchimento do formul�rio  (SUBSTRING(@CENTROCUSTO,0,11)
    	if  (SUBSTRING(@CENTROCUSTO,0,12) = ('12.01.02.01'))
    		SELECT @Retorno = 'simoneguimaraes' --'Pool:Group:w_SG' -- COMO SG 
    		
    	else if (@CENTROCUSTO = ('20.01.02.08.70080'))
    		SELECT @Retorno = 'leandropinto' --'Pool:Group:w_VPF' -- COMO VPF
    	
    	else if (SUBSTRING(@CENTROCUSTO,0,9) = ('20.01.01'))
			SELECT @Retorno =  'leandropinto' --'Pool:Group:w_VPF' -- COMO VPF 
    		
    	else if (SUBSTRING(@CENTROCUSTO,0,3) = ('12') OR SUBSTRING(@CENTROCUSTO,0,3) = ('13') 
			OR SUBSTRING(@CENTROCUSTO,0,3) = ('14') OR 	SUBSTRING(@CENTROCUSTO,0,3) = ('15') 
			OR SUBSTRING(@CENTROCUSTO,0,3) = ('16'))
    		SELECT @Retorno =  'lenouraschmidt' -- 'Pool:Group:w_GP' -- COMO GP 
    	
    	else if (SUBSTRING(@CENTROCUSTO,0,3) = ('11') OR SUBSTRING(@CENTROCUSTO,0,3) = ('18') 
			OR SUBSTRING(@CENTROCUSTO,0,3) = ('50') OR SUBSTRING(@CENTROCUSTO,0,3) = ('90') 
			OR SUBSTRING(@CENTROCUSTO,0,3) = ('99'))
    		SELECT @Retorno =  'leandropinto' --'Pool:Group:w_VPF' --// COMO VPF 
    	
    	else
    		SELECT @Retorno =  'simoneguimaraes' --'Pool:Group:w_SG' -- // COMO SG 
    	
		RETURN @Retorno 


    END

GO


