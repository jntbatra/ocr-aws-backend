import { Command as $Command } from "@smithy/smithy-client";
import { MetadataBearer as __MetadataBearer } from "@smithy/types";
import { AnalyzeIDRequest, AnalyzeIDResponse } from "../models/models_0";
import {
  ServiceInputTypes,
  ServiceOutputTypes,
  TextractClientResolvedConfig,
} from "../TextractClient";
export { __MetadataBearer };
export { $Command };
export interface AnalyzeIDCommandInput extends AnalyzeIDRequest {}
export interface AnalyzeIDCommandOutput
  extends AnalyzeIDResponse,
    __MetadataBearer {}
declare const AnalyzeIDCommand_base: {
  new (
    input: AnalyzeIDCommandInput
  ): import("@smithy/smithy-client").CommandImpl<
    AnalyzeIDCommandInput,
    AnalyzeIDCommandOutput,
    TextractClientResolvedConfig,
    ServiceInputTypes,
    ServiceOutputTypes
  >;
  new (
    input: AnalyzeIDCommandInput
  ): import("@smithy/smithy-client").CommandImpl<
    AnalyzeIDCommandInput,
    AnalyzeIDCommandOutput,
    TextractClientResolvedConfig,
    ServiceInputTypes,
    ServiceOutputTypes
  >;
  getEndpointParameterInstructions(): import("@smithy/middleware-endpoint").EndpointParameterInstructions;
};
export declare class AnalyzeIDCommand extends AnalyzeIDCommand_base {
  protected static __types: {
    api: {
      input: AnalyzeIDRequest;
      output: AnalyzeIDResponse;
    };
    sdk: {
      input: AnalyzeIDCommandInput;
      output: AnalyzeIDCommandOutput;
    };
  };
}
