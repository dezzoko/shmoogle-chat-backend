export class RtcCallDto {
  to: string;
  candidate?: RTCIceCandidate;
  sdp?: RTCSessionDescriptionInit;
}
