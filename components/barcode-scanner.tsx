"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Camera, Upload, Search, Loader2 } from "lucide-react"

interface BarcodeScannerProps {
  onScan: (data: any) => void
  onClose: () => void
}

// Mock database of component specifications
const componentDatabase = {
  "123456789012": {
    barcode: "123456789012",
    name: "Intel Core i7-13700K",
    manufacturer: "Intel",
    model: "i7-13700K",
    description: "13th Gen Intel Core Processor",
    specs: "16 cores, 24 threads, 3.4GHz base, 5.4GHz boost, 125W TDP",
    color: "#0071c5",
    category: "CPU",
  },
  "987654321098": {
    barcode: "987654321098",
    name: "NVIDIA RTX 4080",
    manufacturer: "NVIDIA",
    model: "GeForce RTX 4080",
    description: "High-performance graphics card",
    specs: "16GB GDDR6X, 2505MHz boost clock, 320W TDP",
    color: "#76b900",
    category: "GPU",
  },
  "456789123456": {
    barcode: "456789123456",
    name: "Corsair Vengeance LPX 32GB",
    manufacturer: "Corsair",
    model: "CMK32GX4M2E3200C16",
    description: "DDR4 Memory Kit",
    specs: "32GB (2x16GB), DDR4-3200, CL16, 1.35V",
    color: "#ffcc00",
    category: "Memory",
  },
  "789123456789": {
    barcode: "789123456789",
    name: "Samsung 980 PRO 2TB",
    manufacturer: "Samsung",
    model: "MZ-V8P2T0B/AM",
    description: "NVMe SSD",
    specs: "2TB capacity, PCIe 4.0, 7000MB/s read, 5100MB/s write",
    color: "#1f8dd6",
    category: "Storage",
  },
}

export function BarcodeScanner({ onScan, onClose }: BarcodeScannerProps) {
  const [activeTab, setActiveTab] = useState("camera")
  const [manualBarcode, setManualBarcode] = useState("")
  const [isScanning, setIsScanning] = useState(false)
  const [scannedData, setScannedData] = useState<any>(null)
  const [customSpecs, setCustomSpecs] = useState({
    name: "",
    manufacturer: "",
    model: "",
    description: "",
    specs: "",
    color: "#8b5cf6",
  })
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Simulate camera access
  useEffect(() => {
    if (activeTab === "camera") {
      // In a real implementation, you would use navigator.mediaDevices.getUserMedia
      // For demo purposes, we'll just show a placeholder
    }
  }, [activeTab])

  const lookupBarcode = (barcode: string) => {
    const component = componentDatabase[barcode as keyof typeof componentDatabase]
    if (component) {
      setScannedData(component)
      return component
    }
    return null
  }

  const handleManualScan = () => {
    if (manualBarcode.trim()) {
      setIsScanning(true)
      // Simulate API lookup delay
      setTimeout(() => {
        const result = lookupBarcode(manualBarcode.trim())
        if (result) {
          setScannedData(result)
        } else {
          // If not found, allow manual entry
          setScannedData({
            barcode: manualBarcode.trim(),
            name: "Unknown Component",
            manufacturer: "Unknown",
            model: "Unknown",
            description: "Component not found in database",
            specs: "Please enter specifications manually",
            color: "#6b7280",
            category: "Unknown",
          })
        }
        setIsScanning(false)
      }, 1500)
    }
  }

  const handleCameraScan = () => {
    setIsScanning(true)
    // Simulate camera scanning - in real implementation, use a barcode scanning library
    setTimeout(() => {
      // For demo, randomly select a component
      const barcodes = Object.keys(componentDatabase)
      const randomBarcode = barcodes[Math.floor(Math.random() * barcodes.length)]
      const result = lookupBarcode(randomBarcode)
      setScannedData(result)
      setIsScanning(false)
    }, 2000)
  }

  const handleCustomAdd = () => {
    const customComponent = {
      barcode: `custom-${Date.now()}`,
      name: customSpecs.name || "Custom Component",
      manufacturer: customSpecs.manufacturer || "Unknown",
      model: customSpecs.model || "Unknown",
      description: customSpecs.description || "Custom component",
      specs: customSpecs.specs || "No specifications provided",
      color: customSpecs.color,
      category: "Custom",
    }
    onScan(customComponent)
  }

  const handleAddScanned = () => {
    if (scannedData) {
      onScan(scannedData)
    }
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Scan Component Barcode</DialogTitle>
          <DialogDescription>Scan a barcode to automatically load component specifications</DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="camera">Camera</TabsTrigger>
            <TabsTrigger value="manual">Manual</TabsTrigger>
            <TabsTrigger value="custom">Custom</TabsTrigger>
          </TabsList>

          <TabsContent value="camera" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Camera className="h-5 w-5" />
                  Camera Scanner
                </CardTitle>
                <CardDescription>Use your device camera to scan component barcodes</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="relative">
                  <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center border-2 border-dashed">
                    <div className="text-center">
                      <Camera className="h-12 w-12 mx-auto text-gray-400 mb-2" />
                      <p className="text-sm text-gray-500">Camera preview would appear here</p>
                      <p className="text-xs text-gray-400 mt-1">
                        In a real implementation, this would show live camera feed
                      </p>
                    </div>
                  </div>
                  <canvas ref={canvasRef} className="hidden" />
                </div>
                <Button onClick={handleCameraScan} disabled={isScanning} className="w-full">
                  {isScanning ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Scanning...
                    </>
                  ) : (
                    <>
                      <Camera className="mr-2 h-4 w-4" />
                      Start Camera Scan
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="manual" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Search className="h-5 w-5" />
                  Manual Entry
                </CardTitle>
                <CardDescription>Enter a barcode number manually to look up specifications</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="barcode">Barcode Number</Label>
                  <Input
                    id="barcode"
                    placeholder="Enter barcode (try: 123456789012)"
                    value={manualBarcode}
                    onChange={(e) => setManualBarcode(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleManualScan()}
                  />
                </div>
                <Button onClick={handleManualScan} disabled={isScanning || !manualBarcode.trim()} className="w-full">
                  {isScanning ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Looking up...
                    </>
                  ) : (
                    <>
                      <Search className="mr-2 h-4 w-4" />
                      Lookup Component
                    </>
                  )}
                </Button>
                <div className="text-xs text-gray-500 space-y-1">
                  <p>
                    <strong>Try these sample barcodes:</strong>
                  </p>
                  <p>• 123456789012 (Intel i7-13700K)</p>
                  <p>• 987654321098 (NVIDIA RTX 4080)</p>
                  <p>• 456789123456 (Corsair 32GB RAM)</p>
                  <p>• 789123456789 (Samsung 980 PRO SSD)</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="custom" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="h-5 w-5" />
                  Custom Component
                </CardTitle>
                <CardDescription>Manually enter component details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="custom-name">Component Name</Label>
                    <Input
                      id="custom-name"
                      placeholder="e.g., Intel Core i5"
                      value={customSpecs.name}
                      onChange={(e) => setCustomSpecs((prev) => ({ ...prev, name: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="custom-manufacturer">Manufacturer</Label>
                    <Input
                      id="custom-manufacturer"
                      placeholder="e.g., Intel"
                      value={customSpecs.manufacturer}
                      onChange={(e) => setCustomSpecs((prev) => ({ ...prev, manufacturer: e.target.value }))}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="custom-model">Model</Label>
                  <Input
                    id="custom-model"
                    placeholder="e.g., i5-13600K"
                    value={customSpecs.model}
                    onChange={(e) => setCustomSpecs((prev) => ({ ...prev, model: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="custom-description">Description</Label>
                  <Input
                    id="custom-description"
                    placeholder="Brief description"
                    value={customSpecs.description}
                    onChange={(e) => setCustomSpecs((prev) => ({ ...prev, description: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="custom-specs">Specifications</Label>
                  <Textarea
                    id="custom-specs"
                    placeholder="Enter detailed specifications..."
                    value={customSpecs.specs}
                    onChange={(e) => setCustomSpecs((prev) => ({ ...prev, specs: e.target.value }))}
                    rows={3}
                  />
                </div>
                <div>
                  <Label htmlFor="custom-color">Color</Label>
                  <Input
                    id="custom-color"
                    type="color"
                    value={customSpecs.color}
                    onChange={(e) => setCustomSpecs((prev) => ({ ...prev, color: e.target.value }))}
                  />
                </div>
                <Button onClick={handleCustomAdd} className="w-full">
                  Add Custom Component
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {scannedData && (
          <Card className="mt-4">
            <CardHeader>
              <CardTitle className="text-green-600">Component Found!</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <strong>Name:</strong> {scannedData.name}
                </div>
                <div>
                  <strong>Manufacturer:</strong> {scannedData.manufacturer}
                </div>
                <div>
                  <strong>Model:</strong> {scannedData.model}
                </div>
                <div>
                  <strong>Category:</strong> {scannedData.category}
                </div>
              </div>
              <div>
                <strong>Description:</strong> {scannedData.description}
              </div>
              <div>
                <strong>Specifications:</strong> {scannedData.specs}
              </div>
              <div className="flex items-center gap-2 pt-2">
                <div className="w-4 h-4 rounded-full" style={{ backgroundColor: scannedData.color }} />
                <span className="text-sm">Component Color</span>
              </div>
              <Button onClick={handleAddScanned} className="w-full mt-4">
                Add to Schematic
              </Button>
            </CardContent>
          </Card>
        )}

        <div className="flex justify-end gap-2 pt-4">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
