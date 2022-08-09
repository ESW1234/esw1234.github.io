
{{- define "armada.probes.livenessProbe" -}}
initialDelaySeconds: 30
timeoutSeconds: 1
periodSeconds: 10
failureThreshold: 3
httpGet:
    path: {{ .Values.deployment.livenessProbe.path }}
    port: {{ .Values.deployment.livenessProbe.containerPort }}
{{- end -}}
{{- define "armada.probes.readinessProbe" -}}
initialDelaySeconds: 0
timeoutSeconds: 10
periodSeconds: 10
failureThreshold: 3
httpGet:
    path: {{ .Values.deployment.readinessProbe.path }}
    port: {{ .Values.deployment.readinessProbe.containerPort }}
{{- end -}}

