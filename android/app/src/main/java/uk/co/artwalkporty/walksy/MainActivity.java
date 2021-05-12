package uk.co.artwalkporty.walksy;

import android.os.Bundle;

import com.getcapacitor.BridgeActivity;
import com.getcapacitor.Plugin;

import java.util.ArrayList;

import com.tchvu3.capvoicerecorder.VoiceRecorder;

public class MainActivity extends BridgeActivity {
  @Override
  public void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);

    // Initializes the Bridge
    this.init(savedInstanceState, new ArrayList<Class<? extends Plugin>>() {{
      // Additional plugins you've installed go here
      // Ex: add(TotallyAwesomePlugin.class);
          add(VoiceRecorder.class); // Add this line
    }});
  }

}
