Link multiple bluetooth devices:

```
pactl load-module module-combine-sink
```

Shattering sound fix:

```
/usr/share/pipewire/pipewire.conf -> link.max-buffers = 64
```

How to list bluetooth devices:

```
hcitool dev
```

How to change volume of device:

```
pactl list short
pactl set-sink-volume <DEVICE_ID (e.g. 235)> 20000
```

Tips and tricks:

```
pw-cli ls Port | grep -i bluez

pw-link -l

pw-link Brave:output_FL bluez_output.F8_DF_15_06_A6_4B.1:playback_0
pw-link Brave:output_FR bluez_output.F8_DF_15_06_A6_4B.1:playback_1

pw-link Brave:output_FL bluez_output.30_50_75_08_DA_07.1:playback_0
pw-link Brave:output_FR bluez_output.30_50_75_08_DA_07.1:playback_1
```
