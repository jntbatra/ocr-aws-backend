import { Command as $Command } from "@smithy/smithy-client";
import { MetadataBearer as __MetadataBearer } from "@smithy/types";
import {
  StartDocumentAnalysisRequest,
  StartDocumentAnalysisResponse,
} from "../models/models_0";
import {
  ServiceInputTypes,
  ServiceOutputTypes,
  TextractClientResolvedConfig,
} from "../TextractClient";
export { __MetadataBearer };
export { $Command };
export interface StartDocumentAnalysisCommandInput
  extends StartDocumentAnalysisRequest {}
export interface StartDocumentAnalysisCommandOutput
  extends StartDocumentAnalysisResponse,
    __MetadataBearer {}
declare const StartDocumentAnalysisCommand_base: {
  new (
    input: StartDocumentAnalysisCommandInput
  ): import("@smithy/smithy-client").CommandImpl<
    StartDocumentAnalysisCommandInput,
    StartDocumentAnalysisCommandOutput,
    TextractClientResolvedConfig,
    ServiceInputTypes,
    ServiceOutputTypes
  >;
  new (
    input: StartDocumentAnalysisCommandInput
  ): import("@smithy/smithy-client").CommandImpl<
    StartDocumentAnalysisCommandInput,
    StartDocumentAnalysisCommandOutput,
    TextractClientResolvedConfig,
    ServiceInputTypes,
    ServiceOutputTypes
  >;
  getEndpointParameterInstructions(): import("@smithy/middleware-endpoint").EndpointParameterInstructions;
};
export declare class StartDocumentAnalysisCommand extends StartDocumentAnalysisCommand_base {
  protected static __types: {
    api: {
      input: StartDocumentAnalysisRequest;
      output: StartDocumentAnalysisResponse;
    };
    sdk: {
      input: StartDocumentAnalysisCommandInput;
      output: StartDocumentAnalysisCommandOutput;
    };
  };
}
