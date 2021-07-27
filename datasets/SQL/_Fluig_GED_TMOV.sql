USE [Corporerm_Homolog]
GO

/****** Object:  View [dbo].[_Fluig_GED_TMOV]    Script Date: 08/03/2021 10:39:42 ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO



CREATE VIEW [dbo].[_Fluig_GED_TMOV]

AS

SELECT SUBSTRING(CHAVERM,3,10) AS IDMOV , * FROM HCINTEGRACAOGED where DATASERVER='MovMovimentoData'
GO

