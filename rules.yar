rule MZ_PE_Header {
    meta:
        description = "Detects Windows Portable Executable (PE) headers"
        author = "SecOps Portal Analyzer"
    strings:
        $mz = { 4D 5A }
    condition:
        $mz at 0
}

rule Detect_BlackStorm_Ransomware {
    meta:
        description = "Detects BlackStorm Ransomware signature patterns"
        author = "SecOps Portal Analyzer"
        severity = "Critical"
        tag = "ransomware"
    strings:
        $vss = "vssadmin.exe delete shadows" ascii wide nocase
        $wb = "wbadmin delete catalog" ascii wide nocase
        $ext = ".locked" ascii wide nocase
        $aes = "AES_CBC_encrypt_buffer" ascii wide
        $c2 = "contact_c2_server" ascii wide
    condition:
        MZ_PE_Header and (3 of ($vss, $wb, $ext, $aes, $c2))
}

rule Detect_PHP_Webshell_Backdoor {
    meta:
        description = "Detects PHP web shell commands and backdoors"
        author = "SecOps Portal Analyzer"
        severity = "High"
        tag = "webshell"
    strings:
        $p1 = "eval(" ascii wide
        $p2 = "system(" ascii wide
        $p3 = "$_POST[" ascii wide
        $p4 = "$_GET[" ascii wide
        $p5 = "fsockopen(" ascii wide
    condition:
        any of them
}

rule Detect_Dnstt_DNS_Tunnel {
    meta:
        description = "Detects dnstt DNS tunneling agent signatures"
        author = "SecOps Portal Analyzer"
        severity = "High"
        tag = "dns_tunneling"
    strings:
        $d1 = "dns.c2server.org" ascii wide nocase
        $d2 = "dnstt" ascii wide nocase
        $d3 = "build_dns_query_txt" ascii wide
        $d4 = "tunnel_event_loop" ascii wide
    condition:
        MZ_PE_Header and (2 of them)
}
