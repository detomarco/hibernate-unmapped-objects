
import com.external.library.ExternalParent;

@Embedded
public class ParentEntity extends ExternalParent {
    private Long id;
    protected String protectedField;
    public String publicField;
}
