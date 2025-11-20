import { Command as $Command } from "@smithy/smithy-client";
import { MetadataBearer as __MetadataBearer } from "@smithy/types";
import {
  GetDocumentTextDetectionRequest,
  GetDocumentTextDetectionResponse,
} from "../models/models_0";
import {
  ServiceInputTypes,
  ServiceOutputTypes,
  TextractClientResolvedConfig,
} from "../TextractClient";
export { __MetadataBearer };
export { $Command };
export interface GetDocumentTextDetectionCommandInput
  extends GetDocumentTextDetectionRequest {}
export interface GetDocumentTextDetectionCommandOutput
  extends GetDocumentTextDetectionResponse,
    __MetadataBearer {}
declare const GetDocumentTextDetectionCommand_base: {
  new (
    input: GetDocumentTextDetectionCommandInput
  ): import("@smithy/smithy-client").CommandImpl<
    GetDocumentTextDetectionCommandInput,
    GetDocumentTextDetectionCommandOutput,
    TextractClientResolvedConfig,
    ServiceInputTypes,
    ServiceOutputTypes
  >;
  new (
    input: GetDocumentTextDetectionCommandInput
  ): import("@smithy/smithy-client").CommandImpl<
    GetDocumentTextDetectionCommandInput,
    GetDocumentTextDetectionCommandOutput,
    TextractClientResolvedConfig,
    ServiceInputTypes,
    ServiceOutputTypes
  >;
  getEndpointParameterInstructions(): import("@smithy/middleware-endpoint").EndpointParameterInstructions;
};
export declare class GetDocumentTextDetectionCommand extends GetDocumentTextDetectionCommand_base {
  protected static __types: {
    api: {
      input: GetDocumentTextDetectionRequest;
      output: GetDocumentTextDetectionResponse;
    };
    sdk: {
      input: GetDocumentTextDetectionCommandInput;
      output: GetDocumentTextDetectionCommandOutput;
    };
  };
}
