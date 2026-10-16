import { useRef } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { Camera as CameraIcon, X } from 'lucide-react-native';
import { Button } from '@/components/ui/button';
import { colors, radius, spacing, textStyles } from '@/theme';

/**
 * Live QR scanner. Fires `onScanned` once per mount with the raw QR text; the
 * parent decides whether the text is a valid registration code and closes us.
 */
export function QrScanner({
  onScanned,
  onClose,
}: {
  onScanned: (data: string) => void;
  onClose: () => void;
}) {
  const [permission, requestPermission] = useCameraPermissions();
  const handled = useRef(false);

  if (!permission) {
    return <View style={styles.frame} />;
  }

  if (!permission.granted) {
    return (
      <View style={[styles.frame, styles.permission]}>
        <CameraIcon color={colors.primary[700]} size={32} />
        <Text style={styles.permissionText}>
          Camera access is needed to scan your registration QR code. You can also upload a
          screenshot of the QR or type your code instead.
        </Text>
        {permission.canAskAgain ? (
          <Button onPress={() => void requestPermission()}>Allow camera</Button>
        ) : null}
        <Button variant="ghost" onPress={onClose}>
          Close
        </Button>
      </View>
    );
  }

  return (
    <View style={styles.frame}>
      <CameraView
        style={StyleSheet.absoluteFill}
        facing="back"
        barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
        onBarcodeScanned={({ data }) => {
          if (handled.current) return;
          handled.current = true;
          onScanned(data);
        }}
      />
      <View style={styles.reticle} pointerEvents="none" />
      <View style={styles.closeRow}>
        <Button variant="secondary" icon={X} onPress={onClose}>
          Cancel
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  frame: {
    height: 360,
    borderRadius: radius.lg,
    overflow: 'hidden',
    backgroundColor: colors.secondary[900],
  },
  permission: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
    padding: spacing.xl,
    backgroundColor: colors.surface[100],
  },
  permissionText: { ...textStyles.bodyMuted, textAlign: 'center' },
  reticle: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: 200,
    height: 200,
    marginTop: -100,
    marginLeft: -100,
    borderWidth: 3,
    borderColor: colors.white,
    borderRadius: radius.lg,
  },
  closeRow: { position: 'absolute', bottom: spacing.lg, alignSelf: 'center' },
});
