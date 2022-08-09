
{{- define "mesh.settings_path" }} {{.Values.deployment.env.SETTINGS_ENV}}.{{.Values.deployment.env.SETTINGS_SUBENV}}.{{.Values.deployment.env.SETTINGS_DC}}.{{.Values.deployment.env.SETTINGS_POD}}.{{.Values.deployment.env.SETTINGS_SI}}
{{- end }}

{{- define "armada.ports-json" }}
{{- $internal_ports := list }}
{{- $external_ports := list }}
{{- range .Values.deployment.ports}}
  {{- if eq (.type | default "Internal" | lower) "external" }}
    {{- $external_ports = append $external_ports . }}
  {{- else }}
    {{- $internal_ports = append $internal_ports . }}
  {{- end }}
{{- end }}
{{- dict "external" $external_ports "internal" $internal_ports | toJson }}
{{- end}}

{{/* if service.ingressGateway is not defined, default it to an empty dictionary so indexing it does not fail */}}
{{- define "service.ingressGateway.dnsprefix" }}{{(.Values.service.ingressGateway | default dict).dnsprefix | default ""}}{{- end }}

{{- define "armada.annotations.ingressGatway" -}}
routing.mesh.sfdc.net/gateways: {{ include "service.ingressGateway.dnsprefix" . | default .Values.service.name }}
routing.mesh.sfdc.net/hosts: {{ include "service.ingressGateway.dnsprefix" . | default .Values.service.name }}.sfproxy.{{ .Values.falcon.functional_domain }}.{{ .Values.falcon.falcon_instance }}.{{ .Values.falcon.cloud_provider | lower }}.sfdc.cl
{{- end }}

{{- define "labels"}}
app: {{ .Values.deployment.name }}
name: {{ .Values.deployment.name }}
{{- range $label_name, $label_value := .Values.platform_labels }}
{{ $label_name }}: {{ $label_value }}
{{- end }}
{{- end}}

{{- define "armada.cell-prefix" -}}
{{- if not (has .Values.falcon.cell_instance (list "None" "placeholder")) -}}
{{- .Values.falcon.cell_instance -}}-
{{- end -}}
{{- end -}}

{{- define "armada.deployment.volumes" -}}
{{/* to yaml requests an object so convert from array to object with printf */}}
{{- $volumes := (include "armada.volumes" . | printf "volumes:\n%s" | fromYaml).volumes -}}
{{/* remove mountOptions key since the volume section doesnt support it */}}
{{- range $i, $volume := $volumes }}
  {{- $_ := unset $volume "mountOptions" -}}
{{- end -}}
{{/* only render array if it has a length, so it can be merged with the existing one */}}
{{- if $volumes }}
{{ $volumes |toYaml }}
{{- end -}}
{{- end -}}

{{- define "armada.deployment.main_container.volume_mounts" -}}
{{/* to yaml requests an object so convert from array to object with printf */}}
{{- $volumes := (include "armada.volumes" . | printf "volumes:\n%s" | fromYaml).volumes -}}
{{- $mounts := list -}}
{{/* mount each volume, set the name to match the volume name, a default path and readonly true */}}
{{- range $i, $volume := $volumes }}
  {{- $mount := $volume.mountOptions | default dict  -}}
  {{- $_ := set $mount "name" $volume.name -}}
  {{- $_ := set $mount "mountPath" ($mount.mountPath | default (printf "/armada/mounts/%s" $volume.name)) -}}
  {{- if not (hasKey $mount "readOnly") }}
    {{- $_ := set $mount "readOnly" true -}}
  {{- end -}}
  {{- $mounts = append $mounts $mount  -}}
{{- end -}}
{{/* only render array if it has a length, so it can be merged with the existing one */}}
{{- if $mounts }}
{{ $mounts |toYaml }}
{{- end -}}
{{- end -}}

{{/* Create the default PodDisruptionBudget to use */}}
{{- define "armada.podDisruptionBudget.spec" -}}
{{- if and .Values.deployment.podDisruptionBudget.minAvailable .Values.deployment.podDisruptionBudget.maxUnavailable }}
{{- fail "Cannot set both .Values.podDisruptionBudget.minAvailable and .Values.podDisruptionBudget.maxUnavailable" -}}
{{- end }}
{{- if not .Values.deployment.podDisruptionBudget.maxUnavailable }}
minAvailable: {{ default 1 .Values.deployment.podDisruptionBudget.minAvailable }}
{{- end }}
{{- if .Values.deployment.podDisruptionBudget.maxUnavailable }}
maxUnavailable: {{ .Values.deployment.podDisruptionBudget.maxUnavailable }}
{{- end }}
{{- end }}

