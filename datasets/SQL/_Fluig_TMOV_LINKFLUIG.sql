USE [Corporerm_Homolog]
GO

/****** Object:  StoredProcedure [dbo].[_Fluig_TMOV_LINKFLUIG]    Script Date: 28/07/2021 17:04:29 ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO




/*
28/07/2021 - HERICK FREITAS

PROCEDIMENTO PARA GRAVAR O LINK DO PROCESSO NA MINHACNC

*/

ALTER PROCEDURE [dbo].[_Fluig_TMOV_LINKFLUIG]  
    @IDMOV int,
	@LINK VARCHAR(150)
AS   


 UPDATE TMOVCOMPL
 SET LINKFLUIG = @LINK
 WHERE IDMOV=@IDMOV
 


GO


